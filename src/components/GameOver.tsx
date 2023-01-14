import { signInWithPopup } from "firebase/auth";
import React, { useContext } from "react";
import { GameContext } from "../contexts/GameContext";
import { auth, googleAuthProvider } from "../services/firebase";
import { GameContextType } from "../types";
import { useRouter } from "next/router";

const GameOver = (): JSX.Element => {
  const router = useRouter();
  const {
    totalScore,
    sentHighscore,
    currentHighscore,
    resetGame,
    submitHighscore,
  } = useContext(GameContext) as GameContextType;

  const highscoreSubmitDisabled =
    !auth?.currentUser ||
    totalScore === 0 ||
    sentHighscore ||
    (currentHighscore && totalScore <= currentHighscore?.totalScore);

  const signInWithGoogleAndSubmitHighscore = () => {
    signInWithPopup(auth, googleAuthProvider)
      .then(() => submitHighscore())
      .catch((e: Error) => console.log("Google login failed", e));
  };

  return (
    <div
      style={{
        zIndex: 20,
        top: "50%",
        left: "49.25%",
        transform: "translate(-50%,-50%)",
      }}
      className="relative w-80 p-4 shadow-black bg-gray-700 shadow-lg rounded-xl justify-center items-center flex flex-col"
    >
      <p className="font-bold text-white text-center text-5xl mb-6 select-none">
        Game Over
      </p>
      <button
        onClick={() => resetGame()}
        type="button"
        className="select-none flexjustify-center text-white transition-all duration-200 hover:text-black border-2 border-white hover:bg-white font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:text-gray-400 disabled:bg-white disabled:border-gray-300"
      >
        Play Again
      </button>
      <button
        onClick={() => router.push("/")}
        type="button"
        className="select-none flex mt-4 justify-center text-white transition-all duration-200 hover:text-black border-2 border-white hover:bg-white font-medium rounded-lg text-sm px-5 py-2.5 text-center  disabled:text-gray-400 disabled:bg-white disabled:border-gray-300"
      >
        Main Menu
      </button>
      <button
        disabled={highscoreSubmitDisabled}
        onClick={() => submitHighscore()}
        type="button"
        className="select-none flex mt-4 mb-2 justify-center text-white transition-all duration-200 enabled:hover:text-black border-2 border-white enabled:hover:bg-white font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:text-gray-400 disabled:border-gray-300"
      >
        Submit Highscore
      </button>

      {!auth.currentUser && !sentHighscore && (
        <p className="text-sm text-center text-white my-2 select-none">
          <a
            className="cursor-pointer"
            onClick={() => signInWithGoogleAndSubmitHighscore()}
          >
            <u>Login</u>
          </a>{" "}
          to submit your highscore.
        </p>
      )}

      {currentHighscore && (
        <p className="text-sm text-center text-white my-2 select-none">
          Your current highscore is {currentHighscore.totalScore}.
        </p>
      )}
    </div>
  );
};

export default GameOver;
