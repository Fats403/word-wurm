import React from "react";

type LevelUpModalProps = {
  level: number;
  title: string;
  onClose: () => void;
  perLevelBestWordScore?: { word: string; score: number } | undefined;
  perLevelLongestWord?: string | undefined;
};

const LevelUpModal = ({
  level,
  title,
  onClose,
  perLevelBestWordScore,
  perLevelLongestWord,
}: LevelUpModalProps) => {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-80 max-w-[90vw] p-5 shadow-black bg-black border-2 border-white bg-opacity-90 shadow-lg rounded-xl flex flex-col items-center"
      >
        <div className="absolute -top-8 w-24 h-24 rounded-full bg-yellow-400 opacity-30 blur-xl" />
        <p className="font-bold text-white text-4xl mb-2 select-none">
          Level Up!
        </p>
        <p className="text-white text-sm mb-1 select-none">Now Level</p>
        <p className="font-extrabold text-yellow-300 text-5xl drop-shadow mb-3 select-none">
          {level}
        </p>
        <p className="text-white text-center text-lg mb-5 select-none">
          {title}
        </p>
        {perLevelBestWordScore && perLevelBestWordScore.score > 0 && (
          <div className="w-full mt-2 px-3 py-2 bg-white bg-opacity-10 border border-white/30 rounded-lg">
            <p className="text-white text-xs mb-1 select-none">
              Best Word Score
            </p>
            <p className="text-yellow-300 text-lg font-bold tracking-wide select-none">
              {perLevelBestWordScore.word?.toUpperCase()} —{" "}
              {perLevelBestWordScore.score.toLocaleString("en-US")}
            </p>
          </div>
        )}
        {perLevelLongestWord && (
          <div className="w-full mt-4 mb-8 px-3 py-2 bg-white bg-opacity-10 border border-white/30 rounded-lg">
            <p className="text-white text-xs mb-1 select-none">Longest Word</p>
            <p className="text-blue-200 text-lg font-bold tracking-wide select-none">
              {perLevelLongestWord.toUpperCase()}
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          className="select-none flex justify-center text-white transition-all duration-200 hover:text-black border-2 border-white hover:bg-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;
