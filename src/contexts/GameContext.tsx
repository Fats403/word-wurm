import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useGameGrid } from "../hooks/useGameGrid";
import wordLib from "word-lib";
import {
  CellTypes,
  GameCellData,
  GameContextType,
  GameProviderProps,
  GameSettingsType,
} from "../types";
import consonants from "../utils/consonants";
import {
  baseBonusWordLength,
  baseEmeraldValue,
  baseSaphireValue,
  bonusCellSpawnChance,
  bonusWordMultiplier,
  fireTileChance,
  lengthMultipliers,
  maxBonusCellLength,
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
import { firestore } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import randomNumber from "../utils/randomNumber";
import { FirebaseContext, FirebaseContextState } from "./FirebaseContext";
import { LETTER_FALL_DURATION_MS } from "../utils/animation";

export const GameContext = React.createContext<GameContextType | null>(null);

const GameProvider = ({ children }: GameProviderProps) => {
  const [gameSettings, setGameSettings] = useState<GameSettingsType>({
    numCellsX: 7,
    numCellsY: 7,
    cellSize: 50,
    consonantRatio: 0.67,
  });

  const { user, savedGameState, clearGameState } = useContext(
    FirebaseContext
  ) as FirebaseContextState;

  const [selectedLetters, setSelectedLetters] = useState<GameCellData[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [longestWord, setLongestWord] = useState<string>("");

  const [bonusWordMaxLength, setBonusWordMaxLength] =
    useState<number>(baseBonusWordLength);
  const [bonusWord, setBonusWord] = useState<string>("");

  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  // removed burnEffects system; using visual lookahead in LetterCell instead

  const selectedLettersString = useMemo(
    () => selectedLetters.map((l) => l.value).join(""),
    [selectedLetters]
  );

  const {
    gameGrid,
    setGameGrid,
    getGridCell,
    setGridCell,
    createNewGameGrid,
    loadGameGrid,
  } = useGameGrid(gameSettings);

  const initializeGameState = useCallback(() => {
    savedGameState?.longestWord && setLongestWord(savedGameState.longestWord);
    savedGameState?.totalScore && setTotalScore(savedGameState.totalScore);

    setBonusWord(
      savedGameState
        ? savedGameState.bonusWord
        : wordLib.random(bonusWordMaxLength)
    );

    const grid = savedGameState
      ? loadGameGrid(Object.assign({}, savedGameState.grid))
      : createNewGameGrid();

    setGameGrid(grid);
  }, [
    bonusWordMaxLength,
    createNewGameGrid,
    loadGameGrid,
    savedGameState,
    setGameGrid,
  ]);

  useEffect(() => {
    if (isGameOver) return;
    initializeGameState();
  }, [initializeGameState, isGameOver]);

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
      if (isGameOver || isAnimating) return;

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

    return wordLib.exists(sanitizedString);
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

    const numSaphireTiles = selectedLetters.reduce(
      (acc, cur) => (cur.type === CellTypes.SAPHIRE ? ++acc : acc),
      0
    );

    const bonusCellMultiplier =
      1 +
      numEmeraldTiles * baseEmeraldValue +
      numSaphireTiles * baseSaphireValue;

    if (selectedLettersString.toLowerCase() === bonusWord) {
      addBonusMultiplier = true;
    }

    return Math.round(
      score *
        lengthMultiplier *
        bonusCellMultiplier *
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

  const saveGameState = useCallback(
    (newGrid: GameCellData[][], newStateValues: any): void => {
      if (!user) return;

      const gameState: any = {
        ...newStateValues,
        grid: {},
      };

      newGrid.forEach((col: GameCellData[]) => {
        col.forEach((cell: GameCellData) => {
          gameState.grid[`${cell.x}-${cell.y}`] = cell;
        });
      });

      setDoc(
        doc(firestore, "users", user.uid),
        {
          gameState,
          id: user.uid,
        },
        { merge: true }
      );
    },
    [user]
  );

  const updateGameGridState = useCallback(
    (newStateValues?: any) => {
      setIsAnimating(true);
      // no-op
      let gameOver = false;

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
        gameOver = true;
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

            if (
              !selectedLetters.some((l) => l.x === cell.x && l.y === cell.y)
            ) {
              if (
                // no cell above
                !cellAbove ||
                // this cell is not fire, cell above is not fire
                (cell.type !== CellTypes.FIRE &&
                  cellAbove.type !== CellTypes.FIRE) ||
                // this cell is fire and the cell above is fire
                (cell.type === CellTypes.FIRE &&
                  cellAbove.type === CellTypes.FIRE) ||
                // this cell is fire and the cell above it not fire
                (cell.type === CellTypes.FIRE &&
                  cellAbove.type !== CellTypes.FIRE) ||
                // this cell is NOT fire and the cell above is in the selected letters and is fire
                (cell.type !== CellTypes.FIRE &&
                  cellAbove.type === CellTypes.FIRE &&
                  selectedLetters.some(
                    (l) => l.x === cellAbove.x && l.y === cellAbove.y
                  ))
              ) {
                const previousY = cell.y;
                cell.y = yIndex--;
                cell.prevY = previousY;
                newCol.push(cell);
              }
            }
          }

          if (
            selectedLettersString.length >= 5 &&
            columnIndex === randomBonusTileCol &&
            newCol.length > 0
          ) {
            const bonusCellData =
              selectedLettersString.length <= maxBonusCellLength
                ? bonusCellSpawnChance[selectedLettersString.length]
                : bonusCellSpawnChance[maxBonusCellLength];

            if (Math.random() < bonusCellData.chance) {
              const availableCells: any = newCol.reduce(
                (acc: any, cur: any) => {
                  if (cur.type === CellTypes.NONE) acc.push(cur);
                  return acc;
                },
                []
              );

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
                  type: bonusCellData.type,
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
                selectedLettersString.length === 4
                  ? randomNumber(0.04, 0.08)
                  : 0;

              const random = Math.random();
              if (random < baseChance - bonusChance) {
                newLetterType = CellTypes.FIRE;
              }
            }

            const newLetter: GameCellData = {
              id: `${columnIndex}-${i}-${Date.now()}-${Math.random()}`,
              value: newLetters[i - 1],
              selected: false,
              type: newLetterType,
              y: numNewLetters - i,
              x: columnIndex,
              prevY: -(numNewLetters + 1),
            };

            newLettersGameCells.push(newLetter);
          }

          const _col = [...newCol, ...newLettersGameCells].reverse();

          newGrid[columnIndex] = _col;
        });

        if (!gameOver) {
          // save the game state if its not game over
          saveGameState(newGrid, newStateValues);
        }

        grid = newGrid;
        return grid;
      });

      if (gameOver) {
        clearGameState();
      }

      setSelectedLetters([]);
      setTimeout(() => setIsAnimating(false), LETTER_FALL_DURATION_MS);
    },
    [
      clearGameState,
      gameGrid,
      gameSettings.numCellsX,
      gameSettings.numCellsY,
      generateNewLetters,
      getGridCell,
      level,
      saveGameState,
      selectedLetters,
      selectedLettersString.length,
      setGameGrid,
    ]
  );

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
          if (gameCell.type === CellTypes.NONE) {
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

    updateGameGridState({
      totalScore,
      bonusWord,
      longestWord,
    });
  }, [
    bonusWord,
    gameSettings,
    level,
    longestWord,
    setGameGrid,
    totalScore,
    updateGameGridState,
  ]);

  const resetGame = useCallback((): void => {
    setSelectedLetters([]);
    setLongestWord("");
    setTotalScore(0);
    setBonusWordMaxLength(baseBonusWordLength);
    setBonusWord(wordLib.random(baseBonusWordLength));

    setGameGrid(createNewGameGrid());
    setIsGameOver(false);
  }, [createNewGameGrid, setGameGrid]);

  const submitWord = useCallback((): void => {
    const _score = wordScore ?? 0;
    const newScore = totalScore + _score;

    let newBonusWord = bonusWord;
    let newLongestWord = longestWord;

    if (selectedLettersString.length > longestWord.length) {
      newLongestWord = selectedLettersString;
    }

    if (selectedLettersString.toLowerCase() === bonusWord) {
      const newBonusWordLength =
        baseBonusWordLength + Math.round(Math.random() * Math.floor(level / 5));
      newBonusWord = wordLib.random(newBonusWordLength);
    }

    setTotalScore(newScore);
    setLongestWord(newLongestWord);
    setBonusWord(newBonusWord);

    updateGameGridState({
      totalScore: newScore,
      longestWord: newLongestWord,
      bonusWord: newBonusWord,
    });
  }, [
    wordScore,
    totalScore,
    longestWord,
    selectedLettersString,
    bonusWord,
    updateGameGridState,
    level,
  ]);

  return (
    <GameContext.Provider
      value={{
        level,
        bonusWord,
        isGameOver,
        isAnimating,

        totalScore,
        longestWord,
        wordScore,
        isValidWord,
        selectedLetters,
        gameGrid,
        gameSettings,
        resetGame,
        submitWord,
        selectLetter,
        shuffleGameBoard,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
