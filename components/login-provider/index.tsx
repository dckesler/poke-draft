import { getAuth, signInWithPopup, GoogleAuthProvider, UserCredential } from 'firebase/auth';
import { ReactNode, createContext, FC, useCallback, useState, useEffect } from 'react';

type LoginProvider = {
  children: ReactNode;
}

type LoginContextValues = {login: () => Promise<void>, user: UserCredential['user'] | null}

export const LoginContext = createContext<LoginContextValues>({
  login: async () => {},
  user: null,
})

export const LoginProvider: FC<LoginProvider> = ({ children }) => {
  const [user, setUser] = useState<UserCredential['user'] | null>(null);
  useEffect(() => {
    const auth = getAuth();
    console.log("user", auth.currentUser)
    if (auth.currentUser) {
      setUser(auth.currentUser)
    }
  }, [])
  const login = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result)
      setUser(result.user);
    } catch(e) {
      if (e instanceof Error) {
        throw new Error(`Login failure: ${e.message}`);
      }
    }
  }, [])
  return (
    <LoginContext.Provider value={{user, login}}>
      {children}
    </LoginContext.Provider>
  )
}
