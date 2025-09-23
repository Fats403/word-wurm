import { signInWithPopup } from "firebase/auth";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GameContext } from "../contexts/GameContext";
import { auth, firestore, googleAuthProvider } from "../services/firebase";
import { GameContextType, HighScoreProps } from "../types";
import { useRouter } from "next/router";
import {
  FirebaseContext,
  FirebaseContextState,
} from "../contexts/FirebaseContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Loader from "./Loader";
import {
  ToastContext,
  ToastContextState,
  ToastTypes,
} from "../contexts/ToastContext";

const GameOver = (): JSX.Element => {
  const router = useRouter();

  const [sentHighscore, setSentHighscore] = useState<boolean>(false);
  const [currentHighscoreData, setCurrentHighscoreData] =
    useState<HighScoreProps | null>(null);
  const [isLoadingHighscoreData, setIsLoadingHighScoreData] =
    useState<boolean>(true);

  const { showToast } = useContext(ToastContext) as ToastContextState;
  const { user } = useContext(FirebaseContext) as FirebaseContextState;
  const { totalScore, resetGame, longestWord } = useContext(
    GameContext
  ) as GameContextType;

  const highscoreSubmitDisabled = useMemo(() => {
    if (!user || totalScore === 0 || sentHighscore) {
      return true;
    }

    if (!currentHighscoreData) return false;

    if (
      currentHighscoreData.longestWord &&
      currentHighscoreData.longestWord.length <= longestWord.length
    ) {
      return false;
    }

    if (
      currentHighscoreData.totalScore &&
      currentHighscoreData.totalScore <= totalScore
    ) {
      return false;
    }

    return true;
  }, [
    currentHighscoreData,
    longestWord.length,
    sentHighscore,
    totalScore,
    user,
  ]);

  const submitHighscore = async () => {
    if (!user) return;

    setSentHighscore(true);

    const displayName = user ? user?.displayName?.split(" ")[0] : "";

    const highscoreData: HighScoreProps = {
      displayName,
      id: user.uid,
    };

    if (
      !currentHighscoreData ||
      (currentHighscoreData?.longestWord &&
        currentHighscoreData.longestWord.length < longestWord.length)
    ) {
      highscoreData.longestWord = longestWord;
    }

    if (
      !currentHighscoreData ||
      (currentHighscoreData?.totalScore &&
        currentHighscoreData.totalScore < totalScore)
    ) {
      highscoreData.totalScore = totalScore;
    }

    setDoc(doc(firestore, "highscores", user.uid), highscoreData, {
      merge: true,
    })
      .then(() =>
        showToast({
          message: "Highscore submitted!",
          type: ToastTypes.SUCCESS,
        })
      )
      .catch(() =>
        showToast({
          message: "Something went wrong, try again later.",
          type: ToastTypes.ERROR,
        })
      );
  };

  const signInWithGoogleAndSubmitHighscore = () => {
    signInWithPopup(auth, googleAuthProvider)
      .then(() => submitHighscore())
      .catch((e: Error) => console.log("Google login failed", e));
  };

  const retrieveCurrentHighScore = useCallback(async () => {
    if (!user) {
      setIsLoadingHighScoreData(false);
      return;
    }

    try {
      const docRef = doc(firestore, "highscores", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCurrentHighscoreData(docSnap.data() as HighScoreProps);
      }
    } finally {
      setIsLoadingHighScoreData(false);
    }
  }, [user]);

  useEffect(() => {
    retrieveCurrentHighScore();
  }, [retrieveCurrentHighScore]);

  return (
    <div
      style={{
        zIndex: 20,
        top: "50%",
        left: "49.25%",
        transform: "translate(-50%,-50%)",
      }}
      className="relative w-80 h-80 p-4 shadow-black bg-black border-2 border-white bg-opacity-90 shadow-lg rounded-xl justify-center items-center flex flex-col"
    >
      <p className="font-bold text-white text-center text-5xl mb-8 select-none">
        Game Over
      </p>
      {!isLoadingHighscoreData ? (
        <div className="flex justify-center items-center flex-col">
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

          {!user && !sentHighscore && (
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
          {user &&
            !sentHighscore &&
            totalScore > 0 &&
            highscoreSubmitDisabled &&
            currentHighscoreData && (
              <p className="text-xs text-center text-white mt-1 select-none">
                You didn&apos;t beat your previous score or longest word.
              </p>
            )}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default GameOver;
