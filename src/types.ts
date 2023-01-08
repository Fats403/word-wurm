export interface GameCellData {
  value: string;
  selected: boolean;
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

export type GameSettingsType = {
  numCellsX: number;
  numCellsY: number;
  cellSize: number;
  consonantRatio: number;
};

export type GameContextType = {
  gameGrid: GameCellData[][];
  selectedLetters: GameCellData[];
  gameSettings: GameSettingsType;
  selectLetter: (data: GameCellData) => void;
};
