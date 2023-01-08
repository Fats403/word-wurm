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

    console.log(letters);

    setGameGrid(
      Array.from({ length: numCellsY }, (_, y) =>
        Array.from({ length: numCellsX }, (_, x) => ({
          value: letters[x * numCellsY + y],
          selected: false,
          y,
          x,
        }))
      )
    );
  };

  useEffect(() => {
    generateLetterGrid();
  }, []);

  return { gameGrid, setGameGrid };
};
