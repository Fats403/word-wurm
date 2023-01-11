import React from "react";
import { useContext } from "react";
import { GameContext } from "../contexts/GameContext";
import { auth, googleAuthProvider } from "../services/firebase";
import { GameCellData, GameContextType } from "../types";
import LetterCell from "./LetterCell";
import { signInWithPopup } from "firebase/auth";

const GameGrid = (): JSX.Element => {
  const {
    level,
    gameGrid,
    wordScore,
    totalScore,
    isValidWord,
    longestWord,
    sentHighscore,
    resetGame,
    submitWord,
    submitHighscore,
    shuffleGameBoard,
    isGameOver,
    selectedLetters,
    gameSettings: { numCellsX, numCellsY, cellSize },
  } = useContext(GameContext) as GameContextType;

  const signInWithGoogleAndSubmitHighscore = () => {
    signInWithPopup(auth, googleAuthProvider)
      .then(() => submitHighscore())
      .catch((e: Error) => console.log("Google login failed", e));
  };

  const gridWidth: number = numCellsX * cellSize;
  const gridHeight: number = numCellsY * cellSize + cellSize / 2 - numCellsY;

  return (
    <div
      style={{ width: `${gridWidth}px`, height: `${gridHeight}px` }}
      className="relative"
    >
      {gameGrid.map((row: GameCellData[], yIndex: number) => {
        return (
          <div key={yIndex}>
            {row.map((data, xIndex) => {
              return (
                <LetterCell
                  key={`${xIndex}-${yIndex}`}
                  data={data}
                  size={cellSize}
                />
              );
            })}
          </div>
        );
      })}
      <p className="absolute -top-16 select-none">
        Selected Letters:{" "}
        {selectedLetters
          .map((l) => l.value)
          .join("")
          .toUpperCase()}
      </p>
      <p className="absolute -top-10 select-none">Points: {wordScore}</p>

      <p style={{ position: "absolute", bottom: -35 }} className="select-none">
        Level: {level}
      </p>
      <p style={{ position: "absolute", bottom: -60 }} className="select-none">
        Score: {totalScore}
      </p>
      <p style={{ position: "absolute", bottom: -85 }} className="select-none">
        Longest Word: {longestWord}
      </p>
      {isGameOver && (
        <div
          style={{
            zIndex: 20,
            padding: 32,
            borderRadius: 16,
            backgroundColor: "#000",
            position: "absolute",
            fontSize: 32,
            color: "#FFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            top: "50%",
            left: "49.25%",
            transform: "translate(-50%,-50%)",
          }}
          className="select-none"
        >
          <span className="whitespace-nowrap text-5xl mb-10">GAME OVER</span>
          <button
            onClick={() => resetGame()}
            type="button"
            className="select-none flexjustify-center text-white transition-all duration-200 hover:text-black border border-white hover:bg-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 disabled:text-gray-400 disabled:bg-white disabled:border-gray-300"
          >
            Play Again
          </button>
          <button
            disabled={!auth?.currentUser || sentHighscore || totalScore === 0}
            onClick={() => submitHighscore()}
            type="button"
            className="select-none flex mt-4 justify-center text-white transition-all duration-200 hover:text-black border border-white hover:bg-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 disabled:text-gray-400 disabled:bg-white disabled:border-gray-300"
          >
            Submit Highscore
          </button>
          {!auth.currentUser && (
            <p className="text-sm text-center mt-2 cursor-pointer">
              <a onClick={() => signInWithGoogleAndSubmitHighscore()}>
                <u>Sign in</u>
              </a>{" "}
              to submit your highscore.
            </p>
          )}
        </div>
      )}
      <button
        onClick={() => submitWord()}
        disabled={!isValidWord || isGameOver}
        type="button"
        className="select-none absolute -top-16 right-0 text-blue-700 transition-all duration-200 hover:text-white border border-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 disabled:text-gray-400 disabled:bg-white disabled:border-gray-300"
      >
        Submit
      </button>
      <button
        disabled={Boolean(selectedLetters.length) || isGameOver}
        onClick={() => shuffleGameBoard()}
        type="button"
        style={{ bottom: -90 }}
        className="select-none absolute right-0 text-blue-700 transition-all duration-200 hover:text-white border border-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 disabled:text-gray-400 disabled:bg-white disabled:border-gray-300"
      >
        SCRAMBLE
      </button>
    </div>
  );
};

export default GameGrid;
