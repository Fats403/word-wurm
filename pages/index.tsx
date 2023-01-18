import { signInWithPopup } from "firebase/auth";
import { NextPage } from "next";
import React, { useContext } from "react";
import Page from "../src/components/Page";
import { auth, googleAuthProvider } from "../src/services/firebase";
import { useRouter } from "next/router";
import {
  FirebaseContext,
  FirebaseContextState,
} from "../src/contexts/FirebaseContext";
import Background from "../src/components/Background/Background";

const Login: NextPage = () => {
  const router = useRouter();
  const { user } = useContext(FirebaseContext) as FirebaseContextState;

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleAuthProvider)
      .then(() => router.push("/play"))
      .catch((e: Error) => console.log("Google login failed", e));
  };

  return (
    <Page title="Login">
      <div className="flex flex-col justify-center items-center">
        <WordWurmTitle />

        <div className="flex flex-col justify-center w-64">
          <button
            onClick={() => router.push("/play")}
            type="button"
            className="text-white bg-[#000000] hover:bg-[#000000]/90 font-medium rounded-lg text-sm px-10 py-2.5 text-center text-center"
          >
            {user ? "Play" : "Play as guest"}
          </button>
          <button
            onClick={() => signInWithGoogle()}
            type="button"
            className="mt-4 text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 mr-2 -ml-1"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Sign in with Google
          </button>

          <button
            onClick={() => router.push("/highscores")}
            type="button"
            className="mt-4 text-white bg-[#000000] hover:bg-[#000000]/90 font-medium rounded-lg text-sm px-10 py-2.5 text-center text-center"
          >
            View Highscores
          </button>
          <button
            onClick={() => router.push("/learn")}
            type="button"
            className="mt-4 text-white bg-[#000000] hover:bg-[#000000]/90 font-medium rounded-lg text-sm px-10 py-2.5 text-center text-center"
          >
            Learn How To Play
          </button>
        </div>
      </div>
    </Page>
  );
};

const WordWurmTitle = () => (
  <div className="flex flex-col">
    <div className="flex flex-row space-x-2 mb-6">
      {"WORD".split("").map((letter, index) => (
        <div
          style={{}}
          className="w-12 h-12 flex border-2 border-solid border-gray-900 bg-white rounded-md select-none"
          key={index}
        >
          <div className="flex relative font-bold text-md flex-col justify-center items-center h-full w-full">
            {letter}
          </div>
        </div>
      ))}
    </div>
    <div className=" relative flex flex-row space-x-2 mb-8 pl-8 -top-2">
      {"WURM".split("").map((letter, index) => (
        <div
          style={{}}
          className="w-12 h-12 flex border-2 border-solid border-gray-900 bg-white rounded-md select-none"
          key={index}
        >
          <div className="flex relative font-bold text-md flex-col justify-center items-center h-full w-full">
            {letter}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TitleLetter = () => {};

export default Login;
