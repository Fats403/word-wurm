import React, { useContext } from "react";
import {
  FirebaseContext,
  FirebaseContextState,
} from "../contexts/FirebaseContext";

const SavedGameStateNotice = ({ setContinueGame }: any): JSX.Element => {
  const { clearGameState } = useContext(
    FirebaseContext
  ) as FirebaseContextState;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-300">
      <div className="relative w-80 p-4 shadow-black bg-gray-700 shadow-lg rounded-xl justify-center items-center flex flex-col">
        <p className="font-bold text-white text-center text-md mb-6 select-none">
          {
            "You have a previous game that was wasn't completed. Do you want to resume it?"
          }
        </p>
        <button
          onClick={() => setContinueGame(true)}
          type="button"
          className="select-none flex justify-center text-white transition-all duration-200 hover:text-black border-2 border-white hover:bg-white font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:text-gray-400 disabled:bg-white disabled:border-gray-300"
        >
          Continue
        </button>
        <button
          onClick={() => clearGameState()}
          type="button"
          className="select-none flex mt-4 justify-center text-white transition-all duration-200 hover:text-black border-2 border-white hover:bg-white font-medium rounded-lg text-sm px-5 py-2.5 text-center  disabled:text-gray-400 disabled:bg-white disabled:border-gray-300"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default SavedGameStateNotice;
