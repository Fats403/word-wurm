import React, { useMemo } from "react";
import { useContext } from "react";
import { GameContext } from "../contexts/GameContext";
import { CellTypes, GameContextType, LetterCellProps } from "../types";
import { lettersData } from "../utils/lettersData";
import { motion } from "framer-motion";

const LetterCell = ({ data, size }: LetterCellProps): JSX.Element => {
  const { value, x, y, selected, type } = data;
  const { selectLetter } = useContext(GameContext) as GameContextType;

  const letterTier: number = lettersData[value]?.tier || 1;
  const tierString: string = Array.from({ length: letterTier }, () => "•").join(
    ""
  );

  const targetY = useMemo(
    () => y * size + (x % 2 == 1 ? size / 2 : 0) + (y === 0 ? 0 : y * -1),
    [size, x, y]
  );

  return (
    <motion.div
      onClick={() => selectLetter(data)}
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
    >
      <div className="flex relative flex-col justify-center items-center h-full w-full">
        <span className="z-10 font-bold select-none">{value}</span>
        <span
          style={{ right: 1.5, bottom: -9.5 }}
          className="absolute select-none z-10 text-lg"
        >
          {tierString}
        </span>
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
