import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useGameGrid } from "../hooks/useGameGrid";
import wordLib from "word-lib";
import {
  CellTypes,
  GameCellData,
  GameContextType,
  GameProviderProps,
  GameSettingsType,
  ToastProps,
  ToastTypes,
} from "../types";
import consonants from "../utils/consonants";
import {
  baseBonusWordLength,
  baseEmeraldValueMultiplier,
  bonusWordMultiplier,
  emeraldTileSpawnChance,
  fireTileChance,
  lengthMultipliers,
  maxLetterMultiplierLength,
  maxLevel,
  maxScoreMultiplier,
  scoreToLevelMap,
} from "../utils/scoreData";
import {
  generateNewConsonant,
  generateNewVowel,
  lettersData,
} from "../utils/lettersData";
import shuffle from "../utils/shuffle";
import { auth, firestore } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import randomNumber from "../utils/randomNumber";
import { extendedDictionary } from "../utils/extendedDictionary";

export const GameContext = React.createContext<GameContextType | null>(null);

const GameProvider = ({ children }: GameProviderProps) => {
  const [gameSettings, setGameSettings] = useState<GameSettingsType>({
    numCellsX: 7,
    numCellsY: 7,
    cellSize: 50,
    consonantRatio: 0.67,
  });

  const [currentHighscore, setCurrentHighscore] = useState<any>(null);
  const [selectedLetters, setSelectedLetters] = useState<GameCellData[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [longestWord, setLongestWord] = useState<string>("");
  const [bestWordScore, setBestWordScore] = useState<number>(0);

  const [bonusWordMaxLength, setBonusWordMaxLength] = useState<number>(3);
  const [bonusWord, setBonusWord] = useState<string>("");

  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [sentHighscore, setSentHighscore] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastProps>({
    message: "",
    type: ToastTypes.SUCCESS,
    duration: 3000,
    visible: false,
  });

  const selectedLettersString = useMemo(
    () => selectedLetters.map((l) => l.value).join(""),
    [selectedLetters]
  );

  const { gameGrid, setGameGrid, getGridCell, setGridCell, createNewGameGrid } =
    useGameGrid(gameSettings);

  const showToast = useCallback((props: ToastProps): void => {
    setToast({ ...props });
  }, []);

  const retrieveCurrentHighScore = useCallback(async (): Promise<void> => {
    if (!auth?.currentUser) return;
    const docRef = doc(firestore, "highscores", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
      setCurrentHighscore(docSnap.data());
    }

    setCurrentHighscore(null);
  }, [setCurrentHighscore]);

  useEffect(() => {
    setBonusWord(wordLib.random(bonusWordMaxLength));
    setGameGrid(createNewGameGrid());
  }, [
    bonusWordMaxLength,
    createNewGameGrid,
    retrieveCurrentHighScore,
    setGameGrid,
  ]);

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
      if (isGameOver) return;

      if (!data.selected) {
        const selectionIsNeighbour = lastSelectedNeighbours?.some(
          (cell) => cell.x === data.x && cell.y === data.y
        );

        const cellData: GameCellData = { ...data, selected: !data.selected };

        if (selectedLetters.length === 1 && !selectionIsNeighbour) {
          const selectedCell = getGridCell(data.x, data.y);
          const prevSelectedCell = selectedLetters[0];

          setSelectedLetters([selectedCell]);

          setGridCell(data.x, data.y, cellData);
          setGridCell(prevSelectedCell.x, prevSelectedCell.y, {
            ...prevSelectedCell,
            selected: false,
          });
          return;
        }

        if (!lastSelectedNeighbours || selectionIsNeighbour) {
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
      isGameOver,
      lastSelectedNeighbours,
      selectedLetters,
      setGameGrid,
      setGridCell,
    ]
  );

  const level = useMemo((): number => {
    return (
      scoreToLevelMap.findIndex((score) => totalScore < score) + 1 || maxLevel
    );
  }, [totalScore]);

  const isValidWord = useMemo((): boolean => {
    if (selectedLettersString.length <= 2) return false;

    const sanitizedString = selectedLettersString.toLowerCase();

    if (
      wordLib.exists(sanitizedString) ||
      extendedDictionary.includes(sanitizedString)
    )
      return true;

    return false;
  }, [selectedLettersString]);

  const wordScore = useMemo((): number | null => {
    if (!isValidWord) return null;

    let score = 0;
    let addBonusMultiplier = false;

    const lengthMultiplier: number =
      selectedLettersString.length >= maxLetterMultiplierLength
        ? maxScoreMultiplier
        : lengthMultipliers[selectedLettersString.length];

    selectedLetters.forEach((letter) => {
      const letterScoreData = lettersData[letter.value];
      score += letterScoreData.value * letterScoreData.tier;
    });

    const numEmeraldTiles = selectedLetters.reduce(
      (acc, cur) => (cur.type === CellTypes.EMERALD ? ++acc : acc),
      0
    );

    if (selectedLettersString.toLowerCase() === bonusWord) {
      addBonusMultiplier = true;
    }

    return Math.round(
      score *
        lengthMultiplier *
        (1 + numEmeraldTiles * baseEmeraldValueMultiplier) *
        (addBonusMultiplier ? bonusWordMultiplier : 1)
    );
  }, [bonusWord, isValidWord, selectedLetters, selectedLettersString]);

  const generateNewLetters = useCallback(
    (numLetters: number): string[] => {
      const allLetters: string[] = [];

      gameGrid.forEach((col) => {
        col.forEach((cell) => {
          if (
            !cell.selected &&
            !selectedLetters.some((l) => l.x === cell.x && l.y === cell.y)
          ) {
            allLetters.push(cell.value);
          }
        });
      });

      const letters: string[] = [];

      for (let i = 0; i < numLetters; i++) {
        const numConsonants: number = [...allLetters, ...letters].filter((l) =>
          consonants.includes(l)
        ).length;

        const cRatio = numConsonants / (allLetters.length + letters.length);

        // if the consonant ratio is less then the defined ratio
        if (cRatio < gameSettings.consonantRatio) {
          const consonant = generateNewConsonant(level);
          letters.push(consonant);
        } else {
          const vowel = generateNewVowel();
          letters.push(vowel);
        }
      }

      return letters;
    },
    [level, gameGrid, gameSettings.consonantRatio, selectedLetters]
  );

  const updateGameGridState = useCallback(() => {
    if (
      gameGrid.some((col) =>
        col.some(
          (cell) =>
            cell.y === gameSettings.numCellsY - 1 &&
            cell.type === CellTypes.FIRE &&
            !selectedLetters.some((l) => l.x === cell.x && l.y === cell.y)
        )
      )
    ) {
      setIsGameOver(true);
    }

    const randomBonusTileCol = Math.round(
      randomNumber(0, gameSettings.numCellsX - 1)
    );

    setGameGrid((grid) => {
      const newGrid: GameCellData[][] = [];

      grid.forEach((col, columnIndex) => {
        const newCol = [];
        let i: number;

        let yIndex: number = col.length - 1;
        for (i = col.length - 1; i >= 0; i--) {
          const cell: GameCellData = Object.assign({}, col[i]);
          const cellAbove = getGridCell(cell.x, cell.y - 1);

          if (!selectedLetters.some((l) => l.x === cell.x && l.y === cell.y)) {
            if (
              !cellAbove ||
              (cell.type !== CellTypes.FIRE &&
                cellAbove.type !== CellTypes.FIRE) ||
              (cell.type === CellTypes.FIRE &&
                cellAbove.type === CellTypes.FIRE) ||
              (cell.type === CellTypes.FIRE &&
                cellAbove.type !== CellTypes.FIRE)
            ) {
              cell.y = yIndex--;
              newCol.push(cell);
            }
          }
        }

        if (
          selectedLettersString.length >= 5 &&
          columnIndex === randomBonusTileCol &&
          newCol.length > 0
        ) {
          const spawnChance: number =
            selectedLettersString.length >= 7
              ? 1
              : emeraldTileSpawnChance?.[selectedLettersString.length] || 0.25;

          if (Math.random() < spawnChance) {
            const availableCells: any = newCol.reduce((acc: any, cur: any) => {
              if (cur.type === CellTypes.NONE) acc.push(cur);
              return acc;
            }, []);

            if (availableCells.length > 0) {
              const randomCellIndex = Math.round(
                randomNumber(0, availableCells.length - 1)
              );

              const randomCell = availableCells[randomCellIndex];
              const indxOfRandomCellInNewCol = newCol.findIndex(
                (c) => c.x === randomCell.x && c.y === randomCell.y
              );

              newCol[indxOfRandomCellInNewCol] = {
                ...newCol[indxOfRandomCellInNewCol],
                type: CellTypes.EMERALD,
              };
            }
          }
        }

        if (newCol.length === col.length) {
          newGrid[columnIndex] = newCol.reverse();
          return;
        }

        const newColLength = newCol.length;
        const numNewLetters = col.length - newColLength;
        const newLetters = generateNewLetters(numNewLetters);
        const newLettersGameCells = [];

        for (i = 1; i <= numNewLetters; i++) {
          let newLetterType: number = CellTypes.NONE;
          if (
            selectedLettersString.length === 3 ||
            selectedLettersString.length === 4
          ) {
            // base burning tile chance for 3 letter words
            const baseChance = fireTileChance[level];

            // NOTE: deduct 5 - 10 percent chance off the base chance for four letter words
            const bonusChance =
              selectedLettersString.length === 4 ? randomNumber(0.05, 0.1) : 0;

            const random = Math.random();
            if (random < baseChance - bonusChance) {
              newLetterType = CellTypes.FIRE;
            }
          }

          const newLetter: GameCellData = {
            value: newLetters[i - 1],
            selected: false,
            type: newLetterType,
            y: numNewLetters - i,
            x: columnIndex,
          };

          newLettersGameCells.push(newLetter);
        }

        const _col = [...newCol, ...newLettersGameCells].reverse();

        newGrid[columnIndex] = _col;
      });

      grid = newGrid;
      return grid;
    });

    setSelectedLetters([]);
  }, [
    gameGrid,
    gameSettings.numCellsX,
    gameSettings.numCellsY,
    generateNewLetters,
    getGridCell,
    level,
    selectedLetters,
    selectedLettersString.length,
    setGameGrid,
  ]);

  const submitWord = useCallback((): void => {
    const _score = wordScore ?? 0;
    setTotalScore((score) => score + _score);

    if (selectedLettersString.length > longestWord.length) {
      setLongestWord(selectedLettersString.toUpperCase());
    }

    if (selectedLettersString.toLowerCase() === bonusWord) {
      const newBonusWordLength =
        baseBonusWordLength + Math.round(Math.random() * Math.floor(level / 5));
      setBonusWord(wordLib.random(newBonusWordLength));
    }

    updateGameGridState();
  }, [
    wordScore,
    selectedLettersString,
    longestWord.length,
    bonusWord,
    updateGameGridState,
    level,
  ]);

  const shuffleGameBoard = useCallback((): void => {
    const numFireTiles = 2 + Math.round(Math.random() * Math.floor(level / 4));

    const shouldBeFireCell: boolean[] = shuffle(
      Array.from({ length: gameSettings.numCellsX }, (_, i) =>
        i < numFireTiles ? true : false
      )
    );

    const { numCellsX, numCellsY, consonantRatio } = gameSettings;
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

    setGameGrid((grid) => {
      const newGrid: GameCellData[][] = [];

      grid.forEach((col, xIndex) => {
        const newCol: GameCellData[] = [];

        col.forEach((cell, yIndex) => {
          const gameCell: GameCellData = Object.assign({}, cell);
          if (
            gameCell.type !== CellTypes.FIRE &&
            gameCell.type !== CellTypes.EMERALD
          ) {
            if (yIndex === 0 && shouldBeFireCell[xIndex]) {
              gameCell.type = CellTypes.FIRE;
            }
            gameCell.value = letters[yIndex * numCellsY + xIndex];
          }
          newCol.push(gameCell);
        });
        newGrid.push(newCol);
      });

      grid = newGrid;
      return grid;
    });

    updateGameGridState();
  }, [gameSettings, level, setGameGrid, updateGameGridState]);

  const resetGame = useCallback((): void => {
    setSelectedLetters([]);
    setLongestWord("");
    setTotalScore(0);
    setBonusWordMaxLength(baseBonusWordLength);
    setBonusWord(wordLib.random(baseBonusWordLength));

    setGameGrid(createNewGameGrid());
    setIsGameOver(false);
    setSentHighscore(false);
  }, [createNewGameGrid, setGameGrid]);

  const submitHighscore = async () => {
    if (!auth?.currentUser) return;

    setSentHighscore(true);

    setDoc(doc(firestore, "highscores", auth.currentUser.uid), {
      totalScore,
      displayName: auth.currentUser.displayName
        ? auth.currentUser.displayName.split(" ")[0]
        : "",
      longestWord,
      id: auth.currentUser.uid,
    })
      .then(() =>
        showToast({
          ...toast,
          message: "Highscore submitted!",
          visible: true,
          type: ToastTypes.SUCCESS,
        })
      )
      .catch(() =>
        showToast({
          ...toast,
          message: "Something went wrong, try again later.",
          visible: true,
          type: ToastTypes.ERROR,
        })
      );
  };

  return (
    <GameContext.Provider
      value={{
        level,
        bonusWord,
        currentHighscore,
        sentHighscore,
        isGameOver,
        totalScore,
        longestWord,
        wordScore,
        isValidWord,
        selectedLetters,
        gameGrid,
        gameSettings,
        toast,
        resetGame,
        submitWord,
        submitHighscore,
        showToast,
        selectLetter,
        shuffleGameBoard,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
