import { useCallback, useState } from "react";
import { CellTypes, GameCellData, GameSettingsType } from "../types";
import { generateNewConsonant, generateNewVowel } from "../utils/lettersData";
import shuffle from "../utils/shuffle";

export const useGameGrid = (gameSettings: GameSettingsType) => {
  const { consonantRatio, numCellsX, numCellsY } = gameSettings;
  const [gameGrid, setGameGrid] = useState<GameCellData[][]>([]);

  const createNewGameGrid = useCallback(
    (level = 1): GameCellData[][] => {
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

      return Array.from({ length: numCellsX }, (_, x) =>
        Array.from({ length: numCellsY }, (_, y) => ({
          value: letters[y * numCellsY + x],
          selected: false,
          type: CellTypes.NONE,
          y,
          x,
        }))
      );
    },
    [consonantRatio, numCellsX, numCellsY]
  );

  const loadGameGrid = useCallback(
    (savedGrid: any): GameCellData[][] => {
      return Array.from({ length: numCellsX }, (_, x) =>
        Array.from({ length: numCellsY }, (_, y) => ({
          ...savedGrid[`${x}-${y}`],
        }))
      );
    },
    [numCellsX, numCellsY]
  );

  const getGridCell = (x: number, y: number): GameCellData => {
    return gameGrid?.[x]?.[y];
  };

  const setGridCell = (x: number, y: number, cellData: GameCellData): void => {
    setGameGrid((grid) => {
      grid[x][y] = cellData;
      return grid;
    });
  };

  return {
    gameGrid,
    setGameGrid,
    getGridCell,
    setGridCell,
    createNewGameGrid,
    loadGameGrid,
  };
};
