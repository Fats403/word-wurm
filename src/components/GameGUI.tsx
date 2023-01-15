import React, { useContext } from "react";
import { GameContext } from "../contexts/GameContext";
import { GameContextType } from "../types";

const GameGUI = (): JSX.Element => {
  const { longestWord, bonusWord } = useContext(GameContext) as GameContextType;

  return (
    <div
      style={{ width: 384 }}
      className="p-2 h-14 w-full bg-white shadow-lg border border-gray-500 rounded-xl mb-2 flex flex-row"
    >
      <div className="w-1/2 h-full border-r-2 border-gray-400 flex items-center justify-center flex-col">
        <span className="font-bold text-sm select-none">Longest Word</span>
        <span className="text-xs select-none">
          {longestWord.toUpperCase() || "-"}
        </span>
      </div>
      <div className="w-1/2 h-full flex items-center justify-center flex-col">
        <span className="font-bold text-sm select-none">Bonus Word</span>
        <span className="text-xs select-none">
          {bonusWord.toUpperCase() || "-"}
        </span>
      </div>
    </div>
  );
};

export default GameGUI;
