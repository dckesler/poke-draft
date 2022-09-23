import { createContext, FC, ReactNode } from 'react'
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, set, Database } from 'firebase/database';
import { Pokemon } from "types/pokemon";
import { Player } from 'types/player';
import { DraftGroupStatuses, DraftGroup } from 'types/draft-group'
import { DraftGroupActionTypes, DraftGroupAction } from 'types/draft-group';

const firebaseConfig = {
  apiKey: "AIzaSyB2X2UOjX_9-G8nlt45BiLQt3gnxdUXxeo",
  authDomain: "poke-draft.firebaseapp.com",
  databaseURL: "https://poke-draft-default-rtdb.firebaseio.com",
  projectId: "poke-draft",
  storageBucket: "poke-draft.appspot.com",
  messagingSenderId: "475319021052",
  appId: "1:475319021052:web:cc22925f9ab94712ad1679",
  measurementId: "G-J85RMT0B4X"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const initDraftGroup: DraftGroup = {
    hostPlayer: null,
    browserPlayer: null,
    players: [],
    playerDrafts: {},
    draftingPlayer: null,
    onDeck: [],
    status: DraftGroupStatuses.WAITING,
}



type FirebaseContextValues = readonly [FirebaseApp, Database];

export const FirebaseContext = createContext<FirebaseContextValues>([
  app,
  database,
])

type FirebaseProviderProps = {
  children: ReactNode;
}

export const FirebaseProvider: FC<FirebaseProviderProps> = ({ children }) => {
  return (
    <FirebaseContext.Provider value={[app, database]}>
      {children}
    </FirebaseContext.Provider>
  )
}

