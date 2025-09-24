import React, { useContext, useMemo } from "react";
import { GameContext } from "../contexts/GameContext";
import { CellTypes, GameCellData, GameContextType } from "../types";
import {
  ACTIVE_TUNING,
  ACTIVE_TUNING_KEY,
  baseBonusWordLength,
  baseEmeraldValue,
  baseSaphireValue,
  bonusCellSpawnChance,
  bonusWordMultiplier,
  fireTileChance,
  getTargetVowelRatio,
  lengthMultipliers,
  levelToLetterRarityChance,
  maxBonusCellLength,
  maxLevel,
  scoreToLevelMap,
} from "../utils/scoreData";

type DebugModalProps = {
  onClose: () => void;
};

const DebugModal = ({ onClose }: DebugModalProps): JSX.Element => {
  const {
    level,
    totalScore,
    wordScore,
    isValidWord,
    bonusWord,
    longestWord,
    selectedLetters,
    gameGrid,
    gameSettings,
    isGameOver,
  } = useContext(GameContext) as GameContextType;

  const selectedString = useMemo(
    () => selectedLetters.map((l) => l.value).join(""),
    [selectedLetters]
  );

  const stats = useMemo(() => {
    let fire = 0;
    let emerald = 0;
    let saphire = 0;
    let vowels = 0;
    let consonants = 0;
    const vowelSet = new Set(["A", "E", "I", "O", "U"]);

    gameGrid.forEach((col) =>
      col.forEach((c) => {
        if (c.type === CellTypes.FIRE) fire++;
        if (c.type === CellTypes.EMERALD) emerald++;
        if (c.type === CellTypes.SAPHIRE) saphire++;
        if (vowelSet.has(c.value.toUpperCase())) vowels++;
        else consonants++;
      })
    );

    return {
      dimensions: {
        columns: gameGrid.length,
        rows: gameGrid[0]?.length ?? 0,
      },
      tiles: { fire, emerald, saphire },
      letters: { vowels, consonants },
    };
  }, [gameGrid]);

  const selectedDetail = selectedLetters.map((l) => ({
    x: l.x,
    y: l.y,
    value: l.value,
    type: l.type,
  }));

  const scoreData = useMemo(() => {
    const currentMin = level === 1 ? 0 : scoreToLevelMap[level - 2] + 1;
    const currentMax = level >= maxLevel ? null : scoreToLevelMap[level - 1];
    return {
      activePreset: ACTIVE_TUNING_KEY,
      tuning: ACTIVE_TUNING,
      currentLevel: level,
      currentLevelRange: { min: currentMin, max: currentMax },
      targetVowelRatio: getTargetVowelRatio(level),
      baseValues: {
        baseBonusWordLength,
        bonusWordMultiplier,
        baseEmeraldValue,
        baseSaphireValue,
        maxBonusCellLength,
      },
      tables: {
        scoreToLevelMap,
        lengthMultipliers,
        fireTileChance,
        bonusCellSpawnChance,
        rarityAtLevel: levelToLetterRarityChance[level],
      },
    };
  }, [level]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[90vw] max-w-3xl max-h-[85vh] p-5 shadow-black bg-black border-2 border-white bg-opacity-90 shadow-lg rounded-xl flex flex-col"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-white text-2xl select-none">Debug</p>
          <button
            type="button"
            onClick={onClose}
            className="select-none text-white transition-all duration-200 hover:text-black border-2 border-white hover:bg-white font-medium rounded-lg text-sm px-3 py-1.5"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white overflow-auto">
          <div className="border border-white rounded p-3">
            <p className="font-semibold mb-2">Game</p>
            <pre className="text-xs whitespace-pre-wrap break-words">
              {JSON.stringify(
                { level, totalScore, wordScore, isValidWord, isGameOver },
                null,
                2
              )}
            </pre>
          </div>
          <div className="border border-white rounded p-3">
            <p className="font-semibold mb-2">Words</p>
            <pre className="text-xs whitespace-pre-wrap break-words">
              {JSON.stringify(
                { bonusWord, longestWord, selectedString },
                null,
                2
              )}
            </pre>
          </div>
          <div className="border border-white rounded p-3">
            <p className="font-semibold mb-2">Selected Letters</p>
            <pre className="text-xs whitespace-pre-wrap break-words">
              {JSON.stringify(selectedDetail, null, 2)}
            </pre>
          </div>
          <div className="border border-white rounded p-3">
            <p className="font-semibold mb-2">Grid Stats</p>
            <pre className="text-xs whitespace-pre-wrap break-words">
              {JSON.stringify(stats, null, 2)}
            </pre>
          </div>
          <div className="border border-white rounded p-3 md:col-span-2">
            <p className="font-semibold mb-2">Settings</p>
            <pre className="text-xs whitespace-pre-wrap break-words">
              {JSON.stringify(gameSettings, null, 2)}
            </pre>
          </div>
          <div className="border border-white rounded p-3 md:col-span-2">
            <p className="font-semibold mb-2">Score Data (tuning & ramps)</p>
            <pre className="text-[10px] whitespace-pre-wrap break-words">
              {JSON.stringify(scoreData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugModal;
