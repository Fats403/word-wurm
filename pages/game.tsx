import React from "react";
import type { NextPage } from "next";
import GameGrid from "../src/components/GameGrid";
import GameProvider from "../src/contexts/GameContext";
import Page from "../src/components/Page";
import Toast from "../src/components/Toast";

const Game: NextPage = () => {
  return (
    <Page title="Word Worm">
      <GameProvider>
        <div className="p-4 bg-white shadow-lg border border-gray-300 rounded-xl dark:bg-gray-700">
          <GameGrid />
          <Toast />
        </div>
      </GameProvider>
    </Page>
  );
};

export default Game;
