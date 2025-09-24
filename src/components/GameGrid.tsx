import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { GameContext } from "../contexts/GameContext";
import { GameCellData, GameContextType } from "../types";
import LetterCell from "./LetterCell";
import GameOver from "./GameOver";
import DebugModal from "./DebugModal";
import LevelUpModal from "./LevelUpModal";
import { levelTitles } from "../utils/scoreData";

const GameGrid = (): JSX.Element => {
  const {
    gameGrid,
    isValidWord,
    submitWord,
    shuffleGameBoard,
    isGameOver,
    isAnimating,
    selectedLetters,
    wordScore,
    totalScore,
    level,
    perLevelBestWordScore,
    perLevelLongestWord,
    gameSettings: { numCellsX, numCellsY, cellSize },
  } = useContext(GameContext) as GameContextType;

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const prevLevelRef = useRef(level);
  const prevScoreRef = useRef(totalScore);
  const [displayedScore, setDisplayedScore] = useState<number>(totalScore);

  useEffect(() => {
    if (level > prevLevelRef.current) {
      setShowLevelUp(true);
    }
    prevLevelRef.current = level;
  }, [level]);

  useEffect(() => {
    if (totalScore <= prevScoreRef.current) {
      // Handle reset or non-increment changes
      setDisplayedScore(totalScore);
      prevScoreRef.current = totalScore;
      return;
    }

    const from = prevScoreRef.current;
    const to = totalScore;
    const duration = 600; // ms
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      // EaseOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(from + (to - from) * eased);
      setDisplayedScore(value);
      if (p < 1) raf = requestAnimationFrame(tick);
      else prevScoreRef.current = to;
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [totalScore]);

  const gridWidth: number = numCellsX * cellSize;
  const gridHeight: number = numCellsY * cellSize + cellSize / 2 - numCellsY;

  const submitDisabled: boolean =
    !isValidWord || isGameOver || isAnimating || showLevelUp;
  const shuffleDisabled: boolean =
    Boolean(selectedLetters.length) || isGameOver || isAnimating || showLevelUp;

  return (
    <div className="p-4 bg-white shadow-lg border bg-black bg-opacity-20 border-2 border-white rounded-xl">
      <div className="flex flex-row justify-between w-full items-center">
        <div className="flex flex-col text-white">
          <div className="flex flex-row text-sm select-none">
            <p className="select-none font-medium mr-1">Level:</p>
            {level}
          </div>
          <div className="flex flex-row text-sm select-none items-center">
            <p className="select-none font-medium mr-1">Score:</p>
            <motion.span
              key={totalScore}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                times: [0, 0.5, 1],
              }}
              className="inline-block"
            >
              {displayedScore.toLocaleString("en-us")}
            </motion.span>
          </div>
        </div>

        <button
          disabled={shuffleDisabled}
          onClick={() => shuffleGameBoard()}
          className={
            "mr-1 max-h-12  justify-end relative rounded px-5 py-2.5 overflow-hidden group bg-red-500 relative enabled:hover:bg-gradient-to-r enabled:hover:from-red-500 enabled:hover:to-red-400 text-white enabled:hover:ring-2 enabled:hover:ring-offset-1 hover:ring-red-400 transition-all ease-out duration-300 disabled:text-white disabled:bg-white disabled:border-white border disabled:bg-opacity-60 bg-opacity-60"
          }
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <span className="relative select-none font-medium">Scramble</span>
        </button>

        {/*<button
          onClick={() => setShowDebug(true)}
          className={
            "ml-2 relative max-h-12 bg-opacity-50 rounded px-3 py-2 overflow-hidden group bg-gray-600 enabled:hover:bg-gradient-to-r enabled:hover:from-gray-600 enabled:hover:to-gray-500 text-white enabled:hover:ring-2 enabled:hover:ring-offset-1 hover:ring-gray-400 transition-all ease-out duration-300 border"
          }
        >
          <span className="relative select-none font-medium">Debug</span>
        </button>*/}
      </div>

      <div
        style={{ width: `${gridWidth}px`, height: `${gridHeight}px` }}
        className="relative my-4"
      >
        {gameGrid.map((row: GameCellData[], yIndex: number) => {
          return (
            <div key={yIndex}>
              {row.map((data, xIndex) => {
                return (
                  <LetterCell
                    key={data.id || `${xIndex}-${yIndex}`}
                    data={data}
                    size={cellSize}
                  />
                );
              })}
            </div>
          );
        })}

        {isGameOver && <GameOver />}
        {showDebug && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <DebugModal onClose={() => setShowDebug(false)} />
          </div>
        )}
        {showLevelUp && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <LevelUpModal
              level={level}
              title={levelTitles[level] || "Word Wurm"}
              perLevelBestWordScore={
                perLevelBestWordScore?.[Math.max(1, level - 1)]
              }
              perLevelLongestWord={
                perLevelLongestWord?.[Math.max(1, level - 1)]
              }
              onClose={() => setShowLevelUp(false)}
            />
          </div>
        )}
      </div>
      <div className="flex flex-row justify-between items-end">
        <div className="flex flex-col text-sm">
          <div className="flex flex-row select-none text-white">
            <p className="select-none font-medium mr-2 text-sm">Word Score: </p>
            {wordScore || "-"}
          </div>
          <div className="flex flex-row text-sm select-none text-white">
            <p className="select-none font-medium mr-2 text-sm">
              Selected Letters:{" "}
            </p>
            {selectedLetters
              .map((l) => l.value)
              .join("")
              .toUpperCase() || "-"}
          </div>
        </div>

        <button
          onClick={() => submitWord()}
          disabled={submitDisabled}
          className={
            "mr-1 relative max-h-12 bg-opacity-50 rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative enabled:hover:bg-gradient-to-r enabled:hover:from-green-500 enabled:hover:to-green-400 text-white enabled:hover:ring-2 enabled:hover:ring-offset-1 hover:ring-green-400 transition-all ease-out duration-300 disabled:text-white disabled:bg-white disabled:border-gray-300 border disabled:bg-opacity-60"
          }
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <span className="relative select-none font-medium">Submit</span>
        </button>
      </div>
    </div>
  );
};

export default GameGrid;
