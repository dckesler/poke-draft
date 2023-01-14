import { Player } from 'types/player';
import { Pokemon } from 'types/pokemon';
import {Version} from './versions';

export const DraftGroupStatuses = {
  WAITING: 'WAITING',
  STARTED: 'STARTED',
}

export type DraftGroup = {
  id: string;
  name: string;
  browserPlayer: Player | null;
  hostPlayer: Player | null;
  players: {
    [uid: string]: Player
  };
  playerDrafts: {
    [player: string]: Pokemon[];
  };
  draftingPlayer: Player | null;
  onDeck: Pokemon[];
  status: typeof DraftGroupStatuses[keyof typeof DraftGroupStatuses]
  availableMons: Pokemon[];
  version: Version | null;
};

export type CloudDraftGroup = Omit<DraftGroup, 'browserPlayer'>

export enum DraftGroupActionTypes {
  PLAYER_CONNECTED = "PLAYER_CONNECTED",
  PLAYER_DISCONNECTED = "PLAYER_DISCONNECTED",
  SET_BROWSER_PLAYER = "SET_BROWSER_PLAYER",
  SET_HOST_PLAYER = "SET_HOST_PLAYER",
  CREATE_DRAFT_GROUP = "CREATE_DRAFT_GROUP",
  JOIN_DRAFT_GROUP = "JOIN_DRAFT_GROUP",
  REMOVE_DRAFT_GROUP = "REMOVE_DRAFT_GROUP",
}

export type DraftGroupActionsMap = {
  [DraftGroupActionTypes.PLAYER_CONNECTED]: Player;
  [DraftGroupActionTypes.PLAYER_DISCONNECTED]: Player;
  [DraftGroupActionTypes.SET_BROWSER_PLAYER]: Player;
  [DraftGroupActionTypes.CREATE_DRAFT_GROUP]: {
    hostPlayer: Player;
    version: Version;
    name: string;
  };
  [DraftGroupActionTypes.JOIN_DRAFT_GROUP]: {
    playerId: string;
    id: string;
  };
  [DraftGroupActionTypes.REMOVE_DRAFT_GROUP]: undefined;
}

export type DraftGroupAction = {
  [Key in keyof DraftGroupActionsMap]: {
    type: Key;
    payload: DraftGroupActionsMap[Key];
  };
}[keyof DraftGroupActionsMap];
