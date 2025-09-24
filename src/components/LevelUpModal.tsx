import React from "react";

type LevelUpModalProps = {
  level: number;
  title: string;
  onClose: () => void;
};

const LevelUpModal = ({ level, title, onClose }: LevelUpModalProps) => {
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
