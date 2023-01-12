export const maxLevel = 10;
export const maxScoreMultiplier = 3.5;
export const maxLetterMultiplierLength = 10;

export const LETTER_RARITY_LOW = 3;
export const LETTER_RARITY_MID = 2;
export const LETTER_RARITY_HIGH = 1;

export const scoreToLevelMap: number[] = [
  2000, 6000, 12000, 20000, 30000, 42000, 58000, 76000, 96000, 120000,
];

export const lengthMultipliers: any = {
  3: 1.0,
  4: 1.2,
  5: 1.5,
  6: 1.75,
  7: 2.0,
  8: 2.25,
  9: 2.5,
  10: 3.0,
};

export const fireTileChance: any = {
  1: 0.0,
  2: 0.1,
  3: 0.12,
  4: 0.15,
  5: 0.18,
  6: 0.22,
  7: 0.26,
  8: 0.3,
  9: 0.35,
  10: 0.4,
};

export const maxLetterDifficulty: any = {
  [LETTER_RARITY_LOW]: 0.4,
  [LETTER_RARITY_MID]: 0.32,
  [LETTER_RARITY_HIGH]: 0.28,
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
    [LETTER_RARITY_LOW]: 0.6,
    [LETTER_RARITY_MID]: 0.28,
    [LETTER_RARITY_HIGH]: 0.12,
  },
  5: {
    [LETTER_RARITY_LOW]: 0.55,
    [LETTER_RARITY_MID]: 0.3,
    [LETTER_RARITY_HIGH]: 0.14,
  },
  6: {
    [LETTER_RARITY_LOW]: 0.52,
    [LETTER_RARITY_MID]: 0.32,
    [LETTER_RARITY_HIGH]: 0.16,
  },
  7: {
    [LETTER_RARITY_LOW]: 0.5,
    [LETTER_RARITY_MID]: 0.33,
    [LETTER_RARITY_HIGH]: 0.17,
  },
  8: {
    [LETTER_RARITY_LOW]: 0.5,
    [LETTER_RARITY_MID]: 0.32,
    [LETTER_RARITY_HIGH]: 0.18,
  },
  9: {
    [LETTER_RARITY_LOW]: 0.47,
    [LETTER_RARITY_MID]: 0.33,
    [LETTER_RARITY_HIGH]: 0.2,
  },
  10: {
    [LETTER_RARITY_LOW]: 0.45,
    [LETTER_RARITY_MID]: 0.31,
    [LETTER_RARITY_HIGH]: 0.24,
  },
};
