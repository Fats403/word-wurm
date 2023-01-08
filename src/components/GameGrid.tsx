import React from "react";
import { useContext } from "react";
import { GameContext } from "../contexts/GameContext";
import { GameCellData, GameContextType } from "../types";
import LetterCell from "./LetterCell";

const GameGrid = (): JSX.Element => {
  const {
    gameGrid,
    selectedLetters,
    gameSettings: { numCellsX, numCellsY, cellSize },
  } = useContext(GameContext) as GameContextType;

  const gridWidth: number = numCellsX * cellSize;
  const gridHeight: number = numCellsY * cellSize + cellSize / 2 - numCellsY;

  console.log(gameGrid);

  return (
    <div
      style={{ width: `${gridWidth}px`, height: `${gridHeight}px` }}
      className="relative"
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
      <p className="absolute -top-8">
        Selected Letters:{" "}
        {selectedLetters
          .map((l) => l.value)
          .join("")
          .toUpperCase()}
      </p>
    </div>
  );
};

export default GameGrid;
