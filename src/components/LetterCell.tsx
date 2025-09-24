import React, { useMemo } from "react";
import { useContext } from "react";
import { GameContext } from "../contexts/GameContext";
import { CellTypes, GameContextType, LetterCellProps } from "../types";
import { lettersData } from "../utils/lettersData";
import { motion } from "framer-motion";
import { LETTER_FALL_DURATION_S } from "../utils/animation";

export const LETTER_ARROW_SCALE = 0.4; // fraction of cell size used for arrow width

const LetterCell = ({ data, size }: LetterCellProps): JSX.Element => {
  const { value, x, y, selected, type, prevY } = data as any;
  const { selectLetter, selectedLetters, gameGrid } = useContext(
    GameContext
  ) as GameContextType;

  const letterTier: number = lettersData[value]?.tier || 1;
  const tierString: string = Array.from({ length: letterTier }, () => "•").join(
    ""
  );

  const computeTop = (yy: number, xx: number): number =>
    yy * size + (xx % 2 == 1 ? size / 2 : 0) + (yy === 0 ? 0 : yy * -1);

  const initialTop = useMemo(
    () => computeTop(typeof prevY === "number" ? prevY : y, x),
    [computeTop, prevY, y, x]
  );

  const targetY = useMemo(() => computeTop(y, x), [computeTop, y, x]);

  const arrowTransform = useMemo(() => {
    if (!selected) return null;

    const index = selectedLetters.findIndex((l) => l.x === x && l.y === y);
    if (index === -1 || index === selectedLetters.length - 1) return null;

    const next = selectedLetters[index + 1];
    if (!next) return null;

    const currentLeft = x * size + (x === 0 ? 0 : x * -1) + size / 2;
    const currentTop =
      y * size +
      (x % 2 == 1 ? size / 2 : 0) +
      (y === 0 ? 0 : y * -1) +
      size / 2;

    const nextLeft =
      next.x * size + (next.x === 0 ? 0 : next.x * -1) + size / 2;
    const nextTop =
      next.y * size +
      (next.x % 2 == 1 ? size / 2 : 0) +
      (next.y === 0 ? 0 : next.y * -1) +
      size / 2;

    const dy = nextTop - currentTop;
    const dx = nextLeft - currentLeft;

    const angleInRadians = Math.atan2(dy, dx);
    const angleInDegrees = (angleInRadians * 180) / Math.PI;
    const centerDistance = Math.sqrt(dx * dx + dy * dy);

    return { angleInDegrees, translatePx: centerDistance / 2 };
  }, [selected, selectedLetters, size, x, y]);

  const arrowWidth = useMemo(
    () => Math.max(16, Math.floor(size * LETTER_ARROW_SCALE)),
    [size]
  );
  const arrowHeight = useMemo(
    () => Math.round((arrowWidth * 10) / 16),
    [arrowWidth]
  );

  const preBurnHeight = useMemo(
    () => Math.max(4, Math.floor(size * 0.18)),
    [size]
  );

  return (
    <motion.div
      onClick={() => selectLetter(data)}
      initial={{
        left: x * size + (x === 0 ? 0 : x * -1),
        top: initialTop,
      }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: x * size + (x === 0 ? 0 : x * -1),
        top: targetY,
      }}
      className={
        selected
          ? "flex cursor-pointer rounded-lg absolute border border-solid border-gray-900 transition duration-200 ease-in-out bg-amber-400"
          : "flex cursor-pointer rounded-lg absolute border border-solid border-gray-900 transition duration-200 ease-in-out bg-white hover:bg-amber-200"
      }
      animate={{
        left: x * size + (x === 0 ? 0 : x * -1),
        top: targetY,
      }}
      transition={{ duration: LETTER_FALL_DURATION_S, ease: "easeInOut" }}
    >
      <div className="flex relative flex-col justify-center items-center h-full w-full">
        {/* Pre-burn glow: highlight tiles with a FIRE tile directly above */}
        {(() => {
          const above = gameGrid?.[x]?.[y - 1];
          const show = above && above.type === CellTypes.FIRE;
          if (!show) return null;
          return (
            <motion.div
              className="absolute left-0 right-0 rounded-t-lg"
              style={{
                top: 0,
                height: preBurnHeight,
                background:
                  "linear-gradient(to bottom, rgba(255,69,0,0.6), rgba(255,69,0,0.25), rgba(255,69,0,0))",
                pointerEvents: "none",
                zIndex: 10,
                transformOrigin: "top",
              }}
              initial={{ opacity: 0.6, scaleY: 0.95 }}
              animate={{ opacity: [0.6, 0.9, 0.6], scaleY: [0.95, 1.35, 0.95] }}
              transition={{
                duration: 2.0,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          );
        })()}
        <span className="z-10 font-bold select-none">{value}</span>
        <span
          style={{ right: 1.5, bottom: -9.5 }}
          className="absolute select-none z-10 text-lg"
        >
          {tierString}
        </span>
        {arrowTransform !== null && (
          <div
            className="absolute z-20"
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotate(${arrowTransform.angleInDegrees}deg) translate(${arrowTransform.translatePx}px, 0)`,
              pointerEvents: "none",
            }}
          >
            <svg width={arrowWidth} height={arrowHeight} viewBox="0 0 16 10">
              <path
                d="M1 5 H11 M8 2 L11 5 L8 8"
                stroke="#000000"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        {type === CellTypes.FIRE && (
          <div className="z-0 absolute w-full h-full rounded-lg absolute bg-gradient-radial from-white to-red-600 animate-pulse opacity-40"></div>
        )}
        {type === CellTypes.EMERALD && (
          <div className="z-0 absolute w-full h-full rounded-lg absolute bg-gradient-radial from-white to-green-600 animate-pulse opacity-40"></div>
        )}
        {type === CellTypes.SAPHIRE && (
          <div className="z-0 absolute w-full h-full rounded-lg absolute bg-gradient-radial from-white to-blue-600 animate-pulse opacity-40"></div>
        )}
      </div>
    </motion.div>
  );
};

export default LetterCell;
