import { NextPage } from "next";
import React from "react";
import Page from "../src/components/Page";
import { useRouter } from "next/router";

const Learn: NextPage = () => {
  const router = useRouter();

  return (
    <Page title="How To Play">
      <div className="flex flex-col border-solid border-2 border-black rounded-lg p-6 max-w-md">
        <h1 className="font-bold leading-tight text-5xl mt-0 mb-2 text-black mb-6 text-center">
          LEARN TO PLAY
        </h1>

        <div className="flex flex-col justify-center items-center">
          <li className="mb-4 text-center">
            Click on the letters to link them into words
          </li>
          <li className="mb-4 text-center">
            Click on submit to add your word score to your total score. The
            length of the word and the rarity of the letters will increase the
            overall score of your word!
          </li>
          <li className="mb-4 text-center">
            Watch out for red burning tiles, they burn the tile below them. If
            they reach the bottom its game over.
          </li>
          <li className="mb-6 text-center">
            Scrambling the board will randomize all the tiles not including
            burning tiles. It will also give you more burning tiles.
          </li>
          <p className="font-bold">Good Luck!</p>
        </div>

        <button
          onClick={() => router.push("/")}
          type="button"
          className="mt-6 text-white bg-[#000000] hover:bg-[#000000]/90 font-medium rounded-lg text-sm px-10 py-2.5 text-center text-center dark:focus:ring-[#000000]/55 mr-2 mb-2"
        >
          Back
        </button>
      </div>
    </Page>
  );
};

export default Learn;
