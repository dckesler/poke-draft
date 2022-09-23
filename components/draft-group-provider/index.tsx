import { useEffect, createContext, FC, ReactNode, useCallback, useContext, useState, useMemo } from "react";
import { get, ref, set, onValue, off } from "firebase/database";
import { drafts } from 'data/draft-lists/index';

import {
  DraftGroup,
  DraftGroupAction,
  DraftGroupActionTypes,
  DraftGroupStatuses,
  DraftGroupActionsMap,
  CloudDraftGroup,
} from "types/draft-group";
import { FirebaseContext } from "components/firebase-provider";

type DraftGroupProviderProps = {
  children: ReactNode;
};

type DraftGroupDispatcher = <
Type extends keyof DraftGroupActionsMap,
Payload extends DraftGroupActionsMap[Type]
>(
  type: Type,
  // This line makes it so if there shouldn't be a payload then
  // you only need to call the function with the type, but if
  // there should be a payload then you need the second argument.
  ...payload: Payload extends undefined ? [undefined?] : [Payload]
) => Promise<void>;

const emptyDraftGroup: DraftGroup = {
  browserPlayer: null,
  hostPlayer: null,
  draftingPlayer: null,
  players: [],
  playerDrafts: {},
  onDeck: [],
  status: DraftGroupStatuses.WAITING,
  availableMons: [],
  version: null,
};

type DGC = {
  draftGroup: DraftGroup,
  dispatch: DraftGroupDispatcher,
  draftGroupId: string | null,
}

export const DraftGroupContext = createContext<DGC>({
  draftGroup: emptyDraftGroup,
  dispatch: async () => {},
  draftGroupId: null,
});

export const DraftGroupProvider: FC<DraftGroupProviderProps> = ({
  children,
}) => {
  const [fbApp, fbDatabase] = useContext(FirebaseContext);
  const [draftGroup, setDraftGroup] = useState<DraftGroup>(emptyDraftGroup);
  const [draftGroupId, setDraftGroupId] = useState<string | null>(null);

  const setCloudData = useCallback(async (state: CloudDraftGroup) => {
    if (!draftGroupId) {
      throw new Error('Attempted to set cloud data without draft group ID');
    }
    const cloudUrl = `/draft-groups/${draftGroupId}`;
    const draftRef = ref(fbDatabase, cloudUrl);
    set(draftRef, state);
  }, [draftGroupId, fbDatabase])

  const getCloudData = useCallback<() => Promise<CloudDraftGroup>>(async () => {
    if (!draftGroupId) {
      throw new Error('Attempted to get cloud data without draft group ID');
    }
    const cloudUrl = `/draft-groups/${draftGroupId}`;
    const draftRef = ref(fbDatabase, cloudUrl);
    const snapshot = await get(draftRef);
    const data = snapshot.val() as CloudDraftGroup;
    return data;
  }, [draftGroupId, fbDatabase])

  const dispatch = useCallback<DraftGroupDispatcher>(
    (_type, ..._payload) => {
      return (async function() {
        // Fancy magic to correctly narrow the types
        const action = { type: _type, payload: _payload[0] } as DraftGroupAction
        const { type, payload } = action;

        if (type === DraftGroupActionTypes.SET_DRAFT_GROUP_ID) {
          if (draftGroupId !== payload) {
            setDraftGroup(emptyDraftGroup);
            setDraftGroupId(payload);
          }
        }

        else if (type === DraftGroupActionTypes.CREATE_DRAFT_GROUP) {
          const { hostPlayer, version } = payload;
          const newState = {
            version: version,
            hostPlayer: hostPlayer,
            players: [hostPlayer],
            playerDrafts: {
              [hostPlayer.id]: [],
            },
            draftingPlayer: null,
            onDeck: [],
            status: 'waiting',
            availableMons: drafts[version],
          }
          await setCloudData(newState);
          setDraftGroup({
            ...newState,
            browserPlayer: hostPlayer,
          });
        }

        else if (type === DraftGroupActionTypes.JOIN_DRAFT_GROUP) {
          const cloudDraft = await getCloudData();
          if (!cloudDraft) throw new Error('Attempted to join non-existant draft group');
          setDraftGroup({
            ...cloudDraft,
            browserPlayer: payload,
          });
        }

        else if (type === DraftGroupActionTypes.CLOUD_UPDATE) {
          setDraftGroup((state) => ({
            ...payload,
            browserPlayer:state.browserPlayer
          }));
        }
      })();

    },
    [setCloudData, getCloudData, draftGroupId]
  );

  // Cloud DB listener
  useEffect(() => {
    if (!draftGroupId) return;

    const cloudUrl = `/draft-groups/${draftGroupId}`;
    const draftGroupRef = ref(fbDatabase, cloudUrl);
    onValue(draftGroupRef, (snapshot) => {
      const data = snapshot.val() as CloudDraftGroup;
      if (data) {
        dispatch(DraftGroupActionTypes.CLOUD_UPDATE, data);
      }
    })
    return () => {
      off(draftGroupRef);
    }
  }, [fbDatabase, dispatch, draftGroupId])

  return (
    <DraftGroupContext.Provider value={{draftGroup, dispatch, draftGroupId}}>
      {children}
    </DraftGroupContext.Provider>
  );
};
