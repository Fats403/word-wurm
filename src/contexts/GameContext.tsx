import React, { useCallback, useMemo, useState } from "react";
import { useGameGrid } from "../hooks/useGameGrid";
import wordExists from "word-exists";
import {
  GameCellData,
  GameContextType,
  GameProviderProps,
  GameSettingsType,
} from "../types";
import lettersData from "../utils/lettersData";
import consonants from "../utils/consonants";
import vowels from "../utils/vowels";
import shuffle from "../utils/shuffle";

export const GameContext = React.createContext<GameContextType | null>(null);

const GameProvider = ({ children }: GameProviderProps) => {
  const [gameSettings, setGameSettings] = useState<GameSettingsType>({
    numCellsX: 7,
    numCellsY: 7,
    cellSize: 60,
    consonantRatio: 0.72,
  });

  const [selectedLetters, setSelectedLetters] = useState<GameCellData[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);

  const selectedLettersString = useMemo(
    () => selectedLetters.map((l) => l.value).join(""),
    [selectedLetters]
  );

  const { gameGrid, setGameGrid, getGridCell, setGridCell } =
    useGameGrid(gameSettings);

  const lastSelectedNeighbours = useMemo((): GameCellData[] | null => {
    if (selectedLetters.length === 0) return null;

    const lastCell = selectedLetters[selectedLetters.length - 1];
    const openNeighbours: GameCellData[] = [];

    const n = getGridCell(lastCell.x, lastCell.y - 1);
    const s = getGridCell(lastCell.x, lastCell.y + 1);
    const e = getGridCell(lastCell.x + 1, lastCell.y);
    const w = getGridCell(lastCell.x - 1, lastCell.y);

    const nw = getGridCell(lastCell.x - 1, lastCell.y - 1);
    const ne = getGridCell(lastCell.x + 1, lastCell.y - 1);
    const sw = getGridCell(lastCell.x - 1, lastCell.y + 1);
    const se = getGridCell(lastCell.x + 1, lastCell.y + 1);

    if (n && !n.selected) openNeighbours.push(n);
    if (s && !s.selected) openNeighbours.push(s);
    if (e && !e.selected) openNeighbours.push(e);
    if (w && !w.selected) openNeighbours.push(w);

    // check north/south diagonals based on grid skew
    if (lastCell.x % 2 === 1) {
      if (sw && !sw.selected) openNeighbours.push(sw);
      if (se && !se.selected) openNeighbours.push(se);
    } else {
      if (nw && !nw.selected) openNeighbours.push(nw);
      if (ne && !ne.selected) openNeighbours.push(ne);
    }

    return openNeighbours;
  }, [getGridCell, selectedLetters]);

  const selectLetter = useCallback(
    (data: GameCellData): void => {
      if (!data.selected) {
        if (
          !lastSelectedNeighbours ||
          lastSelectedNeighbours.some(
            (cell) => cell.x === data.x && cell.y === data.y
          )
        ) {
          const cellData: GameCellData = { ...data, selected: !data.selected };
          setSelectedLetters((letters) => [...letters, cellData]);
          setGridCell(data.x, data.y, cellData);
        }
      } else {
        if (selectedLetters.length === 1) {
          const cell = getGridCell(data.x, data.y);
          setGridCell(data.x, data.y, { ...cell, selected: false });
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
            grid[letter.x][letter.y] = {
              ...grid[letter.x][letter.y],
              selected: false,
            };
          }
          return grid;
        });
      }
    },
    [
      getGridCell,
      lastSelectedNeighbours,
      selectedLetters,
      setGameGrid,
      setGridCell,
    ]
  );

  const isValidWord = useMemo((): boolean => {
    if (selectedLettersString.length <= 2) return false;
    const sanitizedString = selectedLettersString.toLowerCase();
    return wordExists(sanitizedString);
  }, [selectedLettersString]);

  const wordScore = useMemo((): number | null => {
    if (!isValidWord) return null;

    let score = 0;

    selectedLetters.forEach((letter) => {
      const value = lettersData[letter.value].value;
      score += value;
    });

    return score;
  }, [isValidWord, selectedLetters]);

  const generateNewLetter = (): string => {
    const allLetters = shuffle([...consonants, ...vowels]);
    return allLetters[Math.floor(Math.random() * allLetters.length)];
  };

  const submitWord = useCallback((): void => {
    const _score = wordScore ?? 0;

    setGameGrid((grid) => {
      const newGrid: GameCellData[][] = [];
      grid.forEach((col, columnIndex) => {
        const newCol = [];
        let i: number;

        let yIndex: number = col.length - 1;
        for (i = col.length - 1; i >= 0; i--) {
          const cell: GameCellData = Object.assign({}, col[i]);
          if (!selectedLetters.some((l) => l.x === cell.x && l.y === cell.y)) {
            cell.y = yIndex;
            newCol.push(cell);
            --yIndex;
          }
        }

        if (newCol.length === col.length) {
          newGrid[columnIndex] = newCol.reverse();
          return;
        }

        const newColLength = newCol.length;
        const numNewLetters = col.length - newColLength;
        const newLetters = [];

        for (i = 1; i <= numNewLetters; i++) {
          const newLetter: GameCellData = {
            value: generateNewLetter(),
            selected: false,
            y: numNewLetters - i,
            x: columnIndex,
          };
          newLetters.push(newLetter);
        }

        const _col = [...newCol, ...newLetters].reverse();

        newGrid[columnIndex] = _col;
      });

      grid = newGrid;
      return grid;
    });

    setTotalScore((score) => score + _score);
    setSelectedLetters([]);
  }, [selectedLetters, setGameGrid, wordScore]);

  return (
    <GameContext.Provider
      value={{
        submitWord,
        totalScore,
        wordScore,
        isValidWord,
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
