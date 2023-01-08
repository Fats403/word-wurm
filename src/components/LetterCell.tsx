import React from "react";
import { useContext } from "react";
import { GameContext } from "../contexts/GameContext";
import { GameContextType, LetterCellProps } from "../types";
import lettersData from "../utils/letterScores";

const LetterCell = ({ data, size }: LetterCellProps): JSX.Element => {
  const { value, x, y, selected } = data;

  const letterTier: number = lettersData[value]?.tier || 1;
  const tierString: string = Array.from({ length: letterTier }, () => "•").join(
    ""
  );

  const { selectLetter } = useContext(GameContext) as GameContextType;

  return (
    <div
      onClick={() => selectLetter(data)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: x * size + (x === 0 ? 0 : -1 * x),
        top:
          y * size +
          (x % 2 == 1 ? size / 2 : 0) + // vertical offset on odd rows
          (y === 0 ? 0 : -1 * y), // line offset
      }}
      className={
        selected
          ? "flex cursor-pointer absolute border border-solid border-gray-900 transition duration-200 ease-in-out bg-amber-400"
          : "flex cursor-pointer absolute border border-solid border-gray-900 transition duration-200 ease-in-out bg-white hover:bg-amber-100"
      }
    >
      <div className="flex relative flex-col justify-center items-center h-full w-full">
        <span className="font-bold select-none">{value}</span>
        <span
          style={{ right: 1.5, bottom: -6 }}
          className="absolute select-none"
        >
          {tierString}
        </span>
      </div>
    </div>
  );
};

export default LetterCell;
