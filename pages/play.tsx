import React, { useContext, useEffect } from "react";
import type { NextPage } from "next";
import GameGrid from "../src/components/GameGrid";
import GameProvider from "../src/contexts/GameContext";
import Page from "../src/components/Page";
import GameGUI from "../src/components/GameGUI";
import {
  FirebaseContext,
  FirebaseContextState,
} from "../src/contexts/FirebaseContext";
import Loader from "../src/components/Loader";
import SavedGameStateNotice from "../src/components/SavedGameStateNotice";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../src/services/firebase";

const Game: NextPage = () => {
  const { isLoadingAuth, user, savedGameState, setGameState } = useContext(
    FirebaseContext
  ) as FirebaseContextState;

  const [continueGame, setContinueGame] = React.useState<boolean>(false);
  const [isLoadingSavedGame, setIsLoadingSavedGame] =
    React.useState<boolean>(true);

  const fetchSavedGameData = React.useCallback((): void => {
    if (!user) {
      setIsLoadingSavedGame(false);
      return;
    }

    getDoc(doc(firestore, "users", user.uid))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.data();
          if (userData.gameState) {
            setGameState(userData.gameState);
          }
        }
      })
      .finally(() => setIsLoadingSavedGame(false));
  }, [setGameState, user]);

  useEffect(() => {
    if (isLoadingAuth) return;
    fetchSavedGameData();
  }, [fetchSavedGameData, isLoadingAuth]);

  if (isLoadingAuth || isLoadingSavedGame) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-300">
        <Loader />
      </div>
    );
  }

  if (savedGameState && !continueGame) {
    return <SavedGameStateNotice setContinueGame={setContinueGame} />;
  }

  return (
    <Page title="Word Worm" animatedBg={false}>
      <GameProvider>
        <GameGUI />
        <GameGrid />
      </GameProvider>
    </Page>
  );
};

export default Game;
