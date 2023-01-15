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

export enum ToastTypes {
  SUCCESS = 1,
  WARNING = 2,
  ERROR = 3,
}

export enum HighscoreSortingTypes {
  SCORE = 1,
  LONGEST_WORD = 2,
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

export type GameProviderProps = {
  children?: JSX.Element | JSX.Element[];
};

export type PageProps = {
  children?: JSX.Element | JSX.Element[];
  title: string;
};

export type ToastProps = {
  message: string;
  duration: number;
  type: ToastTypes;
  visible: boolean;
};

export type GameSettingsType = {
  numCellsX: number;
  numCellsY: number;
  cellSize: number;
  consonantRatio: number;
};

export type GameContextType = {
  gameGrid: GameCellData[][];
  currentHighscore: any;
  wordScore: number | null;
  longestWord: string;
  bonusWord: string;
  level: number;
  totalScore: number;
  isValidWord: boolean;
  selectedLetters: GameCellData[];
  gameSettings: GameSettingsType;
  isGameOver: boolean;
  sentHighscore: boolean;
  selectLetter: (data: GameCellData) => void;
  shuffleGameBoard: () => void;
  resetGame: () => void;
  submitWord: () => void;
  submitHighscore: () => void;
  showToast: (props: ToastProps) => void;
  toast: ToastProps;
};
