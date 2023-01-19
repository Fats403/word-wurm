import React from "react";
import { useContext } from "react";
import { GameContext } from "../contexts/GameContext";
import { GameCellData, GameContextType } from "../types";
import LetterCell from "./LetterCell";
import GameOver from "./GameOver";

const GameGrid = (): JSX.Element => {
  const {
    gameGrid,
    isValidWord,
    submitWord,
    shuffleGameBoard,
    isGameOver,
    selectedLetters,
    wordScore,
    totalScore,
    level,
    gameSettings: { numCellsX, numCellsY, cellSize },
  } = useContext(GameContext) as GameContextType;

  const gridWidth: number = numCellsX * cellSize;
  const gridHeight: number = numCellsY * cellSize + cellSize / 2 - numCellsY;

  const submitDisabled: boolean = !isValidWord || isGameOver;
  const shuffleDisabled: boolean =
    Boolean(selectedLetters.length) || isGameOver;

  return (
    <div className="p-4 bg-white shadow-lg border bg-black bg-opacity-20 border-2 border-white rounded-xl">
      <div className="flex flex-row justify-between w-full items-center">
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
                    key={`${xIndex}-${yIndex}`}
                    data={data}
                    size={cellSize}
                  />
                );
              })}
            </div>
          );
        })}

        {isGameOver && <GameOver />}
      </div>
      <div className="flex flex-row justify-between items-end">
        <div className="flex flex-col text-white">
          <div className="flex flex-row text-sm select-none">
            <p className="select-none font-medium mr-1">Level:</p>
            {level}
          </div>
          <div className="flex flex-row text-sm select-none">
            <p className="select-none font-medium mr-1">Score:</p>
            {totalScore.toLocaleString("en-us")}
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
      </div>
    </div>
  );
};

export default GameGrid;
