import { CellTypes } from "../types";

export const maxScoreMultiplier = 3.5;
export const maxLetterMultiplierLength = 10;

export const baseEmeraldValue = 0.5;
export const baseSaphireValue = 1.5;

export const baseBonusWordLength = 3;
export const bonusWordMultiplier = 3.5;

export const LETTER_RARITY_LOW = 3;
export const LETTER_RARITY_MID = 2;
export const LETTER_RARITY_HIGH = 1;

export const maxLevel = 10;
export const scoreToLevelMap: number[] = [
  2000, 8000, 14000, 22000, 34000, 48000, 64000, 96000, 130000,
];

export const maxBonusCellLength = 8;

export const bonusCellSpawnChance: any = {
  5: {
    type: CellTypes.EMERALD,
    chance: 0.4,
  },
  6: {
    type: CellTypes.EMERALD,
    chance: 0.8,
  },
  7: {
    type: CellTypes.SAPHIRE,
    chance: 1,
  },
  8: {
    type: CellTypes.SAPHIRE,
    chance: 1,
  },
};

export const lengthMultipliers: any = {
  3: 1.0,
  4: 1.25,
  5: 1.5,
  6: 2,
  7: 2.5,
  8: 3,
  9: 3.5,
  10: 4,
};

export const fireTileChance: any = {
  1: 0.0,
  2: 0.05,
  3: 0.07,
  4: 0.09,
  5: 0.11,
  6: 0.12,
  7: 0.13,
  8: 0.14,
  9: 0.15,
  10: 0.16,
};

export const levelToLetterRarityChance: any = {
  1: {
    [LETTER_RARITY_LOW]: 0.7,
    [LETTER_RARITY_MID]: 0.25,
    [LETTER_RARITY_HIGH]: 0.05,
  },
  2: {
    [LETTER_RARITY_LOW]: 0.68,
    [LETTER_RARITY_MID]: 0.22,
    [LETTER_RARITY_HIGH]: 0.07,
  },
  3: {
    [LETTER_RARITY_LOW]: 0.65,
    [LETTER_RARITY_MID]: 0.25,
    [LETTER_RARITY_HIGH]: 0.1,
  },
  4: {
    [LETTER_RARITY_LOW]: 0.62,
    [LETTER_RARITY_MID]: 0.28,
    [LETTER_RARITY_HIGH]: 0.1,
  },
  5: {
    [LETTER_RARITY_LOW]: 0.6,
    [LETTER_RARITY_MID]: 0.3,
    [LETTER_RARITY_HIGH]: 0.1,
  },
  6: {
    [LETTER_RARITY_LOW]: 0.58,
    [LETTER_RARITY_MID]: 0.32,
    [LETTER_RARITY_HIGH]: 0.1,
  },
  7: {
    [LETTER_RARITY_LOW]: 0.56,
    [LETTER_RARITY_MID]: 0.33,
    [LETTER_RARITY_HIGH]: 0.11,
  },
  8: {
    [LETTER_RARITY_LOW]: 0.54,
    [LETTER_RARITY_MID]: 0.34,
    [LETTER_RARITY_HIGH]: 0.12,
  },
  9: {
    [LETTER_RARITY_LOW]: 0.52,
    [LETTER_RARITY_MID]: 0.35,
    [LETTER_RARITY_HIGH]: 0.13,
  },
  10: {
    [LETTER_RARITY_LOW]: 0.51,
    [LETTER_RARITY_MID]: 0.35,
    [LETTER_RARITY_HIGH]: 0.14,
  },
};
