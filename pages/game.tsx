import React from "react";
import type { NextPage } from "next";
import GameGrid from "../src/components/GameGrid";
import GameProvider from "../src/contexts/GameContext";
import Page from "../src/components/Page";

const Game: NextPage = () => {
  return (
    <Page title="Word Worm">
      <GameProvider>
        <GameGrid />
      </GameProvider>
    </Page>
  );
};

export default Game;
