import * as React from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, firestore } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";

type FirebaseUser = User | null;
export type FirebaseContextState = {
  user: FirebaseUser;
  isLoadingAuth: boolean;
  savedGameState: any | null;
  clearGameState: () => void;
  setGameState: (gameState: any) => void;
};

interface IFirebaseProvider {
  children?: JSX.Element | JSX.Element[];
}

export const FirebaseContext = React.createContext<
  FirebaseContextState | undefined
>(undefined);

const FirebaseProvider = ({ children }: IFirebaseProvider) => {
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = React.useState<boolean>(true);
  const [savedGameState, setSavedGameState] = React.useState<any | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsLoadingAuth(false);
    });
    return unsubscribe;
  }, []);

  const clearGameState = React.useCallback((): void => {
    setSavedGameState(null);
    if (user?.uid) {
      setDoc(
        doc(firestore, "users", user.uid),
        { gameState: null },
        { merge: true }
      );
    }
  }, [user]);

  const setGameState = React.useCallback((gameState: any): void => {
    setSavedGameState(gameState);
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        user,
        isLoadingAuth,
        clearGameState,
        savedGameState,
        setGameState,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseProvider };
