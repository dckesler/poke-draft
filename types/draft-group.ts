import { Player } from 'types/player';
import { Pokemon } from 'types/pokemon';
import {Version} from './versions';

export const DraftGroupStatuses = {
  WAITING: 'WAITING',
  STARTED: 'STARTED',
}

export type DraftGroup = {
  browserPlayer: Player | null;
  hostPlayer: Player | null;
  players: Player[];
  playerDrafts: {
    [player: number]: Pokemon[];
  };
  draftingPlayer: Player | null;
  onDeck: Pokemon[];
  status: typeof DraftGroupStatuses[keyof typeof DraftGroupStatuses]
  availableMons: Pokemon[];
  version: Version | null;
};

export type CloudDraftGroup = Omit<DraftGroup, 'browserPlayer'>

export enum DraftGroupActionTypes {
  SET_DRAFT_GROUP_ID = "SET_DRAFT_GROUP_ID",
  PLAYER_CONNECTED = "PLAYER_CONNECTED",
  PLAYER_DISCONNECTED = "PLAYER_DISCONNECTED",
  SET_BROWSER_PLAYER = "SET_BROWSER_PLAYER",
  SET_HOST_PLAYER = "SET_HOST_PLAYER",
  CREATE_DRAFT_GROUP = "CREATE_DRAFT_GROUP",
  JOIN_DRAFT_GROUP = "JOIN_DRAFT_GROUP",
  REMOVE_DRAFT_GROUP = "REMOVE_DRAFT_GROUP",
  CLOUD_UPDATE = "CLOUD_UPDATE",
}

export type DraftGroupActionsMap = {
  [DraftGroupActionTypes.SET_DRAFT_GROUP_ID]: string;
  [DraftGroupActionTypes.PLAYER_CONNECTED]: Player;
  [DraftGroupActionTypes.PLAYER_DISCONNECTED]: Player;
  [DraftGroupActionTypes.SET_BROWSER_PLAYER]: Player;
  [DraftGroupActionTypes.CREATE_DRAFT_GROUP]: {
    hostPlayer: Player;
    version: Version;
  };
  [DraftGroupActionTypes.JOIN_DRAFT_GROUP]: Player;
  [DraftGroupActionTypes.REMOVE_DRAFT_GROUP]: undefined;
  [DraftGroupActionTypes.CLOUD_UPDATE]: CloudDraftGroup;
}

export type DraftGroupAction = {
  [Key in keyof DraftGroupActionsMap]: {
    type: Key;
    payload: DraftGroupActionsMap[Key];
  };
}[keyof DraftGroupActionsMap];
