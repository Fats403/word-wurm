import React from "react";
import type { NextPage } from "next";
import GameGrid from "../src/components/GameGrid";
import GameProvider from "../src/contexts/GameContext";

const Game: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <GameProvider>
        <GameGrid />
      </GameProvider>
    </div>
  );
};

export default Game;
