export const maxScoreMultiplier = 3.5;
export const maxLetterMultiplierLength = 10;

export const baseEmeraldValueMultiplier = 0.5;

export const baseBonusWordLength = 3;
export const bonusWordMultiplier = 3.5;

export const LETTER_RARITY_LOW = 3;
export const LETTER_RARITY_MID = 2;
export const LETTER_RARITY_HIGH = 1;

export const maxLevel = 10;
export const scoreToLevelMap: number[] = [
  2000, 8000, 14000, 22000, 34000, 48000, 64000, 96000, 130000,
];

export const emeraldTileSpawnChance: any = {
  5: 0.25,
  6: 0.5,
};

export const lengthMultipliers: any = {
  3: 1.0,
  4: 1.2,
  5: 1.75,
  6: 2.0,
  7: 2.25,
  8: 2.5,
  9: 3.0,
  10: 3.5,
};

export const fireTileChance: any = {
  1: 0.0,
  2: 0.1,
  3: 0.12,
  4: 0.14,
  5: 0.16,
  6: 0.18,
  7: 0.19,
  8: 0.21,
  9: 0.23,
  10: 0.25,
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
    [LETTER_RARITY_LOW]: 0.56,
    [LETTER_RARITY_MID]: 0.31,
    [LETTER_RARITY_HIGH]: 0.13,
  },
  6: {
    [LETTER_RARITY_LOW]: 0.53,
    [LETTER_RARITY_MID]: 0.32,
    [LETTER_RARITY_HIGH]: 0.14,
  },
  7: {
    [LETTER_RARITY_LOW]: 0.52,
    [LETTER_RARITY_MID]: 0.33,
    [LETTER_RARITY_HIGH]: 0.15,
  },
  8: {
    [LETTER_RARITY_LOW]: 0.5,
    [LETTER_RARITY_MID]: 0.33,
    [LETTER_RARITY_HIGH]: 0.17,
  },
  9: {
    [LETTER_RARITY_LOW]: 0.48,
    [LETTER_RARITY_MID]: 0.34,
    [LETTER_RARITY_HIGH]: 0.18,
  },
  10: {
    [LETTER_RARITY_LOW]: 0.45,
    [LETTER_RARITY_MID]: 0.36,
    [LETTER_RARITY_HIGH]: 0.19,
  },
};
