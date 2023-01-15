import React from "react";
import type { NextPage } from "next";
import GameGrid from "../src/components/GameGrid";
import GameProvider from "../src/contexts/GameContext";
import Page from "../src/components/Page";
import Toast from "../src/components/Toast";
import GameGUI from "../src/components/GameGUI";

const Game: NextPage = () => {
  return (
    <Page title="Word Worm">
      <GameProvider>
        <GameGUI />

        <GameGrid />
        <Toast />
      </GameProvider>
    </Page>
  );
};

export default Game;
