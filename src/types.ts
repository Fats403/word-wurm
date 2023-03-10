export enum CellTypes {
  NONE = 1,
  FIRE = 2,
  EMERALD = 3,
  SAPHIRE = 4,
}

export enum Page {
  LOGIN = 1,
  GAME = 2,
}

export enum HighscoreSortingTypes {
  SCORE = "SCORE",
  LONGEST_WORD = "LONGEST_WORD",
}

export interface GameCellData {
  value: string;
  selected: boolean;
  type: number;
  x: number;
  y: number;
}

export interface LetterData {
  value: number;
  tier: number;
}

export interface LetterDataList {
  [key: string]: LetterData;
}

export interface LetterCellProps {
  data: GameCellData;
  size: number;
}

export interface HighScoreProps {
  id: string;
  displayName: string | undefined;
  longestWord?: string;
  totalScore?: number;
}

export type GameProviderProps = {
  children?: JSX.Element | JSX.Element[];
};

export type PageProps = {
  children?: JSX.Element | JSX.Element[];
  title: string;
  animatedBg?: boolean;
};

export type GameSettingsType = {
  numCellsX: number;
  numCellsY: number;
  cellSize: number;
  consonantRatio: number;
};

export type GameContextType = {
  gameGrid: GameCellData[][];
  wordScore: number | null;
  longestWord: string;
  bonusWord: string;
  level: number;
  totalScore: number;
  isValidWord: boolean;
  selectedLetters: GameCellData[];
  gameSettings: GameSettingsType;
  isGameOver: boolean;
  selectLetter: (data: GameCellData) => void;
  shuffleGameBoard: () => void;
  resetGame: () => void;
  submitWord: () => void;
};
