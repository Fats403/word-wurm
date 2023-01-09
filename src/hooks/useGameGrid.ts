import { useEffect, useState } from "react";
import { GameCellData, GameSettingsType } from "../types";
import consonants from "../utils/consonants";
import shuffle from "../utils/shuffle";
import vowels from "../utils/vowels";

export const useGameGrid = (gameSettings: GameSettingsType) => {
  const { consonantRatio, numCellsX, numCellsY } = gameSettings;
  const [gameGrid, setGameGrid] = useState<GameCellData[][]>([]);

  const generateLetterGrid = (): void => {
    const numCells: number = numCellsX * numCellsY;
    const numConsonants: number = Math.floor(numCells * consonantRatio);
    const numVowels: number = numCells - numConsonants;

    const randomConsonants: string[] = Array.from(
      { length: numConsonants },
      () => consonants[Math.floor(Math.random() * consonants.length)]
    );

    const randomVowels: string[] = Array.from(
      { length: numVowels },
      () => vowels[Math.floor(Math.random() * vowels.length)]
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
