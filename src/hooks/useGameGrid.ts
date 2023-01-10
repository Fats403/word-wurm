import { useEffect, useState } from "react";
import { GameCellData, GameSettingsType } from "../types";
import { generateNewConsonant, generateNewVowel } from "../utils/lettersData";
import shuffle from "../utils/shuffle";

export const useGameGrid = (gameSettings: GameSettingsType) => {
  const { consonantRatio, numCellsX, numCellsY } = gameSettings;
  const [gameGrid, setGameGrid] = useState<GameCellData[][]>([]);

  const generateLetterGrid = (level = 1): void => {
    const numCells: number = numCellsX * numCellsY;
    const numConsonants: number = Math.floor(numCells * consonantRatio);
    const numVowels: number = numCells - numConsonants;

    const randomConsonants: string[] = Array.from(
      { length: numConsonants },
      () => generateNewConsonant(level)
    );

    const randomVowels: string[] = Array.from({ length: numVowels }, () =>
      generateNewVowel()
    );

    const letters: string[] = shuffle([...randomConsonants, ...randomVowels]);

    setGameGrid(
      Array.from({ length: numCellsX }, (_, x) =>
        Array.from({ length: numCellsY }, (_, y) => ({
          value: letters[y * numCellsY + x],
          selected: false,
          y,
          x,
        }))
      )
    );
  };

  const getGridCell = (x: number, y: number): GameCellData => {
    return gameGrid?.[x]?.[y];
  };

  const setGridCell = (x: number, y: number, cellData: GameCellData): void => {
    setGameGrid((grid) => {
      grid[x][y] = cellData;
      return grid;
    });
  };

  useEffect(() => {
    generateLetterGrid();
  }, []);

  return { gameGrid, setGameGrid, getGridCell, setGridCell };
};
