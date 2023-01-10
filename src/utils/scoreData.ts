export const maxLevel = 10;
export const maxScoreMultiplier = 3.5;
export const maxLetterMultiplierLength = 10;

export const LETTER_RARITY_LOW = 3;
export const LETTER_RARITY_MID = 2;
export const LETTER_RARITY_HIGH = 1;

export const scoreToLevelMap: number[] = [
  2000, 8000, 16000, 28000, 30000, 44000, 60000, 78000, 98000, 120000,
];

export const lengthMultipliers: any = {
  3: 1.0,
  4: 1.2,
  5: 1.3,
  6: 1.5,
  7: 1.7,
  8: 2.2,
  9: 2.4,
  10: 3.0,
};

export const maxLetterDifficulty: any = {
  [LETTER_RARITY_LOW]: 0.4,
  [LETTER_RARITY_MID]: 0.3,
  [LETTER_RARITY_HIGH]: 0.3,
};

export const levelToLetterDifficulty: any = {
  1: {
    [LETTER_RARITY_LOW]: 0.7,
    [LETTER_RARITY_MID]: 0.25,
    [LETTER_RARITY_HIGH]: 0.05,
  },
  2: {
    [LETTER_RARITY_LOW]: 0.7,
    [LETTER_RARITY_MID]: 0.23,
    [LETTER_RARITY_HIGH]: 0.07,
  },
  3: {
    [LETTER_RARITY_LOW]: 0.65,
    [LETTER_RARITY_MID]: 0.25,
    [LETTER_RARITY_HIGH]: 0.1,
  },
  4: {
    [LETTER_RARITY_LOW]: 0.6,
    [LETTER_RARITY_MID]: 0.37,
    [LETTER_RARITY_HIGH]: 0.13,
  },
  5: {
    [LETTER_RARITY_LOW]: 0.6,
    [LETTER_RARITY_MID]: 0.34,
    [LETTER_RARITY_HIGH]: 0.14,
  },
  6: {
    [LETTER_RARITY_LOW]: 0.52,
    [LETTER_RARITY_MID]: 0.33,
    [LETTER_RARITY_HIGH]: 0.15,
  },
  7: {
    [LETTER_RARITY_LOW]: 0.5,
    [LETTER_RARITY_MID]: 0.35,
    [LETTER_RARITY_HIGH]: 0.15,
  },
  8: {
    [LETTER_RARITY_LOW]: 0.5,
    [LETTER_RARITY_MID]: 0.32,
    [LETTER_RARITY_HIGH]: 0.18,
  },
  9: {
    [LETTER_RARITY_LOW]: 0.5,
    [LETTER_RARITY_MID]: 0.3,
    [LETTER_RARITY_HIGH]: 0.2,
  },
  10: {
    [LETTER_RARITY_LOW]: 0.45,
    [LETTER_RARITY_MID]: 0.3,
    [LETTER_RARITY_HIGH]: 0.25,
  },
};
