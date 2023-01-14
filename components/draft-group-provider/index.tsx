import { useEffect, createContext, FC, ReactNode, useCallback, useContext, useState, useMemo } from "react";
import { get, ref, set, onValue, off, DatabaseReference } from "firebase/database";
import { drafts } from 'data/draft-lists/index';
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";

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
  id: '',
  name: '',
  browserPlayer: null,
  hostPlayer: null,
  draftingPlayer: null,
  players: {},
  playerDrafts: {},
  onDeck: [],
  status: DraftGroupStatuses.WAITING,
  availableMons: [],
  version: null,
};

type DGC = {
  draftGroup: DraftGroup,
  dispatch: DraftGroupDispatcher,
}

export const DraftGroupContext = createContext<DGC>({
  draftGroup: emptyDraftGroup,
  dispatch: async () => {},
});

export const DraftGroupProvider: FC<DraftGroupProviderProps> = ({
  children,
}) => {
  const [fbApp, fbDatabase] = useContext(FirebaseContext);
  const [draftGroup, setDraftGroup] = useState<DraftGroup>(emptyDraftGroup);
  const [draftSubRef, setDraftSubRef] = useState<DatabaseReference | null>(null);
  const router = useRouter()

  const getCloudData = useCallback<(id: string) => Promise<CloudDraftGroup>>(async (id: string) => {
    const cloudUrl = `/draft-groups/${id}`;
    const draftRef = ref(fbDatabase, cloudUrl);
    const snapshot = await get(draftRef);
    const data = snapshot.val() as CloudDraftGroup;
    return data;
  }, [fbDatabase])

  const subscribeToDraft = useCallback(async (id: string) => {
    if (draftSubRef) {
      off(draftSubRef)
    }
  //
    const cloudUrl = `/draft-groups/${id}`;
    const newRef = ref(fbDatabase, cloudUrl);
    onValue(newRef, (snapshot) => {
      const data = snapshot.val() as CloudDraftGroup;
      if (data) {
        setDraftGroup({
          ...data,
          browserPlayer: draftGroup.browserPlayer
        })
      }
    })
    setDraftSubRef(newRef)
  }, [fbDatabase])

  const dispatch = useCallback<DraftGroupDispatcher>(
    (_type, ..._payload) => {
      return (async function() {
        // Fancy magic to correctly narrow the types
        const action = { type: _type, payload: _payload[0] } as DraftGroupAction
        const { type, payload } = action;

        if (type === DraftGroupActionTypes.CREATE_DRAFT_GROUP) {
          const newDraftId = uuid()
          const cloudUrl = `/draft-groups/${newDraftId}`;
          const draftRef = ref(fbDatabase, cloudUrl);

          const { hostPlayer, version, name } = payload;
          const newState = {
            id: newDraftId,
            name,
            version: version,
            hostPlayer: hostPlayer,
            players: {
              [hostPlayer.id]: hostPlayer
            },
            playerDrafts: {
              [hostPlayer.id]: [],
            },
            draftingPlayer: null,
            onDeck: [],
            status: 'waiting',
            availableMons: drafts[version],
          }
          await set(draftRef, newState);
          setDraftGroup({
            ...newState,
            browserPlayer: hostPlayer,
          });
          router.push(`/draft/${newDraftId}`)
        }

        else if (type === DraftGroupActionTypes.JOIN_DRAFT_GROUP) {
          const { id, playerId } = payload;
          const cloudUrl = `/draft-groups/${id}`;
          let cloudDraft = await getCloudData(id);
          if (!cloudDraft) throw new Error('Attempted to join non-existant draft group');

          let player = cloudDraft.players[playerId]
          if (!player) {
            const playerUrl = `${cloudUrl}/players/${playerId}`
            const playerRef = ref(fbDatabase, playerUrl)
            await set(playerRef, {
              id: playerId,
              name: 'New Player',
              status: 'connected'
            })
            cloudDraft = await getCloudData(id);
          }

          setDraftGroup({
            ...cloudDraft,
            browserPlayer: player,
          });
          subscribeToDraft(id)
        }
      })();

    },
    [getCloudData]
  );

  return (
    <DraftGroupContext.Provider value={{draftGroup, dispatch}}>
      {children}
    </DraftGroupContext.Provider>
  );
};
