import React, { useContext, useMemo } from "react";
import { GameContext } from "../contexts/GameContext";
import { GameContextType } from "../types";
import { levelTitles } from "../utils/scoreData";

const GameGUI = (): JSX.Element => {
  const { longestWord, bonusWord, level } = useContext(
    GameContext
  ) as GameContextType;
  const title = useMemo(() => levelTitles[level] || "Word Wurm", [level]);

  return (
    <div
      style={{ width: 384 }}
      className="p-2 w-full bg-black bg-opacity-20 shadow-lg border border-white border-2 rounded-xl mb-2 flex flex-col text-white"
    >
      <div className="w-full h-full flex items-center justify-center flex-col mb-2">
        <span className="text-base font-bold select-none">{title}</span>
      </div>
      <div className="flex flex-row">
        <div className="w-1/2 h-full border-r-2 border-white flex items-center justify-center flex-col">
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
    </div>
  );
};

export default GameGUI;
