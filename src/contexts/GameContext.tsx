import React, { useCallback, useState } from "react";
import { useGameGrid } from "../hooks/useGameGrid";
import {
  GameCellData,
  GameContextType,
  GameProviderProps,
  GameSettingsType,
} from "../types";

export const GameContext = React.createContext<GameContextType | null>(null);

const GameProvider = ({ children }: GameProviderProps) => {
  const [gameSettings, setGameSettings] = useState<GameSettingsType>({
    numCellsX: 7,
    numCellsY: 7,
    cellSize: 60,
    consonantRatio: 0.72,
  });

  const { gameGrid, setGameGrid } = useGameGrid(gameSettings);
  const [selectedLetters, setSelectedLetters] = useState<GameCellData[]>([]);

  const selectLetter = useCallback(
    (data: GameCellData): void => {
      if (!data.selected) {
        const cellData: GameCellData = { ...data, selected: !data.selected };

        setSelectedLetters((letters) => [...letters, cellData]);
        setGameGrid((grid) => {
          grid[data.y][data.x] = cellData;
          return grid;
        });
      } else {
        if (selectedLetters.length === 1) {
          setGameGrid((grid) => {
            grid[data.y][data.x] = { ...grid[data.y][data.x], selected: false };
            return grid;
          });
          setSelectedLetters([]);
          return;
        }

        const index = selectedLetters.findIndex(
          (letter) => letter.x === data.x && letter.y === data.y
        );

        setSelectedLetters(selectedLetters.filter((_, i) => i < index + 1));
        setGameGrid((grid) => {
          for (let i: number = index + 1; i < selectedLetters.length; i++) {
            const letter = selectedLetters[i];
            grid[letter.y][letter.x] = {
              ...grid[letter.y][letter.x],
              selected: false,
            };
          }
          return grid;
        });
      }
    },
    [selectedLetters, setGameGrid]
  );

  console.log(selectedLetters);

  return (
    <GameContext.Provider
      value={{
        selectedLetters,
        gameGrid,
        gameSettings,
        selectLetter,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
