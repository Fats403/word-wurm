import { LetterDataList } from "../types";
import {
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Qu,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y,
  Z,
} from "./letterData";
import {
  LETTER_RARITY_HIGH,
  LETTER_RARITY_MID,
  LETTER_RARITY_LOW,
  maxLevel,
  maxLetterDifficulty,
  levelToLetterDifficulty,
} from "./scoreData";
import vowels from "./vowels";

export const lettersData: LetterDataList = {
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Qu,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y,
  Z,
};

export const vowelData: LetterDataList = {
  A,
  E,
  I,
  O,
  U,
};

export const consonantData = {
  [LETTER_RARITY_LOW]: {
    T,
    R,
    S,
    N,
    L,
    G,
    H,
    D,
  },
  [LETTER_RARITY_MID]: {
    B,
    C,
    F,
    K,
    M,
    P,
    V,
    W,
    Y,
  },
  [LETTER_RARITY_HIGH]: {
    J,
    Qu,
    X,
    Z,
  },
};

export const generateNewConsonant = (level: number): string => {
  const letterChance: number = Math.random();
  const diffultyProbabilties =
    level > maxLevel ? maxLetterDifficulty : levelToLetterDifficulty[level];

  let letterKeys: string[] = [];

  if (letterChance <= diffultyProbabilties[LETTER_RARITY_HIGH]) {
    letterKeys = Object.keys(consonantData[LETTER_RARITY_HIGH]);
  } else if (letterChance <= diffultyProbabilties[LETTER_RARITY_MID]) {
    letterKeys = Object.keys(consonantData[LETTER_RARITY_MID]);
  } else {
    letterKeys = Object.keys(consonantData[LETTER_RARITY_LOW]);
  }

  return letterKeys[Math.floor(Math.random() * letterKeys.length)];
};

export const generateNewVowel = (): string => {
  return vowels[Math.floor(Math.random() * vowels.length)];
};
