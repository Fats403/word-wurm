import { CellTypes } from "../types";

// --------------------
// Tuning: presets + builders
// --------------------

export type TuningPreset = {
  // Levels
  maxLevel: number;
  levelBaseScore: number; // score to reach level 2
  levelGrowthRate: number; // multiplier per level (e.g. 1.35)

  // Word length multipliers
  maxLetterMultiplierLength: number;
  lengthMultiplierStart: number; // multiplier at length 3
  lengthMultiplierGrowth: number; // per additional letter growth
  maxScoreMultiplier: number; // hard cap

  // Bonus word
  baseBonusWordLength: number;
  bonusWordMultiplier: number;

  // Bonus tiles
  maxBonusCellLength: number;
  emeraldSpawnAt: number; // word length at which EMERALD may spawn
  saphireSpawnAt: number; // word length at which SAPHIRE may spawn
  emeraldSpawnChanceAtThreshold: number; // chance at emerald threshold
  saphireSpawnChanceAtThreshold: number; // chance at saphire threshold

  // Fire tiles
  fireStartChance: number; // at level 1
  fireMaxChance: number; // at max level

  // Letter rarity trend (low -> mid -> high) across levels
  rarityLowAtL1: number;
  rarityMidAtL1: number;
  rarityHighAtL1: number;
  rarityLowAtMax: number;
  rarityMidAtMax: number;
  rarityHighAtMax: number;

  // Bonus cell multipliers
  baseEmeraldValue: number;
  baseSaphireValue: number;

  // Vowel ratio target across levels (for dynamic spawning)
  vowelTargetAtL1: number;
  vowelTargetAtMax: number;
};

export const presets: Record<string, TuningPreset> = {
  easy: {
    maxLevel: 15,
    levelBaseScore: 2500,
    levelGrowthRate: 1.28,

    maxLetterMultiplierLength: 10,
    lengthMultiplierStart: 1.0,
    lengthMultiplierGrowth: 0.35,
    maxScoreMultiplier: 3.5,

    baseBonusWordLength: 3,
    bonusWordMultiplier: 3.0,

    maxBonusCellLength: 8,
    emeraldSpawnAt: 5,
    saphireSpawnAt: 7,
    emeraldSpawnChanceAtThreshold: 0.25,
    saphireSpawnChanceAtThreshold: 0.35,

    fireStartChance: 0.0,
    fireMaxChance: 0.18,

    rarityLowAtL1: 0.72,
    rarityMidAtL1: 0.24,
    rarityHighAtL1: 0.04,
    rarityLowAtMax: 0.52,
    rarityMidAtMax: 0.36,
    rarityHighAtMax: 0.12,

    baseEmeraldValue: 0.4,
    baseSaphireValue: 1.25,
    vowelTargetAtL1: 0.36,
    vowelTargetAtMax: 0.32,
  },
  normal: {
    maxLevel: 15,
    levelBaseScore: 4000,
    levelGrowthRate: 1.42,

    maxLetterMultiplierLength: 10,
    lengthMultiplierStart: 1.0,
    lengthMultiplierGrowth: 0.4,
    maxScoreMultiplier: 3.75,

    baseBonusWordLength: 3,
    bonusWordMultiplier: 3.5,

    maxBonusCellLength: 8,
    emeraldSpawnAt: 5,
    saphireSpawnAt: 7,
    emeraldSpawnChanceAtThreshold: 0.4,
    saphireSpawnChanceAtThreshold: 0.45,

    fireStartChance: 0.0,
    fireMaxChance: 0.22,

    rarityLowAtL1: 0.7,
    rarityMidAtL1: 0.25,
    rarityHighAtL1: 0.05,
    rarityLowAtMax: 0.45,
    rarityMidAtMax: 0.39,
    rarityHighAtMax: 0.16,

    baseEmeraldValue: 0.5,
    baseSaphireValue: 1.75,
    vowelTargetAtL1: 0.32,
    vowelTargetAtMax: 0.29,
  },
  hard: {
    maxLevel: 15,
    levelBaseScore: 1800,
    levelGrowthRate: 1.42,

    maxLetterMultiplierLength: 10,
    lengthMultiplierStart: 1.0,
    lengthMultiplierGrowth: 0.45,
    maxScoreMultiplier: 4.0,

    baseBonusWordLength: 3,
    bonusWordMultiplier: 4.0,

    maxBonusCellLength: 8,
    emeraldSpawnAt: 5,
    saphireSpawnAt: 7,
    emeraldSpawnChanceAtThreshold: 0.35,
    saphireSpawnChanceAtThreshold: 0.55,

    fireStartChance: 0.02,
    fireMaxChance: 0.27,

    rarityLowAtL1: 0.68,
    rarityMidAtL1: 0.26,
    rarityHighAtL1: 0.06,
    rarityLowAtMax: 0.4,
    rarityMidAtMax: 0.43,
    rarityHighAtMax: 0.17,

    baseEmeraldValue: 0.6,
    baseSaphireValue: 2.0,
    vowelTargetAtL1: 0.32,
    vowelTargetAtMax: 0.28,
  },
};

export const ACTIVE_TUNING_KEY = "normal"; // change to "easy" | "normal" | "hard" to toggle defaults
export const ACTIVE_TUNING: TuningPreset = presets[ACTIVE_TUNING_KEY];

// --------------------
// Derived builders
// --------------------

export const LETTER_RARITY_LOW = 3;
export const LETTER_RARITY_MID = 2;
export const LETTER_RARITY_HIGH = 1;

export const maxScoreMultiplier = ACTIVE_TUNING.maxScoreMultiplier;
export const maxLetterMultiplierLength =
  ACTIVE_TUNING.maxLetterMultiplierLength;

export const baseEmeraldValue = ACTIVE_TUNING.baseEmeraldValue;
export const baseSaphireValue = ACTIVE_TUNING.baseSaphireValue;

export const baseBonusWordLength = ACTIVE_TUNING.baseBonusWordLength;
export const bonusWordMultiplier = ACTIVE_TUNING.bonusWordMultiplier;

export const maxLevel = ACTIVE_TUNING.maxLevel;

export const scoreToLevelMap: number[] = (() => {
  const arr: number[] = [];
  let threshold = ACTIVE_TUNING.levelBaseScore;
  for (let lvl = 2; lvl <= ACTIVE_TUNING.maxLevel; lvl++) {
    arr.push(Math.round(threshold));
    threshold *= ACTIVE_TUNING.levelGrowthRate;
  }
  return arr;
})();

export const maxBonusCellLength = ACTIVE_TUNING.maxBonusCellLength;

export const bonusCellSpawnChance: any = (() => {
  const out: any = {};
  // Emerald window
  out[ACTIVE_TUNING.emeraldSpawnAt] = {
    type: CellTypes.EMERALD,
    chance: ACTIVE_TUNING.emeraldSpawnChanceAtThreshold,
  };
  // Between emerald and saphire thresholds, keep emerald with rising chance
  const mid = ACTIVE_TUNING.saphireSpawnAt - 1;
  if (mid > ACTIVE_TUNING.emeraldSpawnAt) {
    out[mid] = {
      type: CellTypes.EMERALD,
      chance: Math.min(1, ACTIVE_TUNING.emeraldSpawnChanceAtThreshold + 0.15),
    };
  }
  // Saphire window
  out[ACTIVE_TUNING.saphireSpawnAt] = {
    type: CellTypes.SAPHIRE,
    chance: ACTIVE_TUNING.saphireSpawnChanceAtThreshold,
  };
  if (ACTIVE_TUNING.maxBonusCellLength >= ACTIVE_TUNING.saphireSpawnAt + 1) {
    out[ACTIVE_TUNING.saphireSpawnAt + 1] = {
      type: CellTypes.SAPHIRE,
      chance: Math.min(1, ACTIVE_TUNING.saphireSpawnChanceAtThreshold + 0.2),
    };
  }
  return out;
})();

export const lengthMultipliers: any = (() => {
  const out: any = {};
  let mult = ACTIVE_TUNING.lengthMultiplierStart;
  for (let len = 3; len <= ACTIVE_TUNING.maxLetterMultiplierLength; len++) {
    if (len > 3) mult += ACTIVE_TUNING.lengthMultiplierGrowth;
    out[len] = Math.min(mult, ACTIVE_TUNING.maxScoreMultiplier);
  }
  return out;
})();

export const fireTileChance: any = (() => {
  const out: any = {};
  const start = ACTIVE_TUNING.fireStartChance;
  const end = ACTIVE_TUNING.fireMaxChance;
  for (let lvl = 1; lvl <= ACTIVE_TUNING.maxLevel; lvl++) {
    const t = (lvl - 1) / (ACTIVE_TUNING.maxLevel - 1);
    // ease-in curve for more dramatic ramp late-game
    const eased = t * t;
    out[lvl] = parseFloat((start + (end - start) * eased).toFixed(3));
  }
  return out;
})();

export const levelToLetterRarityChance: any = (() => {
  const out: any = {};
  for (let lvl = 1; lvl <= ACTIVE_TUNING.maxLevel; lvl++) {
    const t = (lvl - 1) / (ACTIVE_TUNING.maxLevel - 1);
    const lerp = (a: number, b: number) => a + (b - a) * t;
    const low = lerp(ACTIVE_TUNING.rarityLowAtL1, ACTIVE_TUNING.rarityLowAtMax);
    const mid = lerp(ACTIVE_TUNING.rarityMidAtL1, ACTIVE_TUNING.rarityMidAtMax);
    const high = lerp(
      ACTIVE_TUNING.rarityHighAtL1,
      ACTIVE_TUNING.rarityHighAtMax
    );
    out[lvl] = {
      [LETTER_RARITY_LOW]: parseFloat(low.toFixed(2)),
      [LETTER_RARITY_MID]: parseFloat(mid.toFixed(2)),
      [LETTER_RARITY_HIGH]: parseFloat(high.toFixed(2)),
    };
  }
  return out;
})();

export const getTargetVowelRatio = (level: number): number => {
  const t = (level - 1) / (ACTIVE_TUNING.maxLevel - 1);
  const lerp = (a: number, b: number) => a + (b - a) * t;
  return parseFloat(
    lerp(ACTIVE_TUNING.vowelTargetAtL1, ACTIVE_TUNING.vowelTargetAtMax).toFixed(
      3
    )
  );
};

// Fun level titles – can tweak per preset later if desired
export const levelTitles: Record<number, string> = {
  1: "Novice Bookwurm",
  2: "Letter Forager",
  3: "Word Dabbler",
  4: "Syllable Slinger",
  5: "Page Turner",
  6: "Lexicon Scout",
  7: "Grammar Wrangler",
  8: "Vocabulary Tactician",
  9: "Sentence Smith",
  10: "Linguistic Adept",
  11: "Thesaurus Tamer",
  12: "Semantic Scholar",
  13: "Word Warden",
  14: "Grand Lexicographer",
  15: "Master Bookwurm",
};
