import { NextPage } from "next";
import React from "react";
import Page from "../src/components/Page";
import { useRouter } from "next/router";

const Learn: NextPage = () => {
  const router = useRouter();

  return (
    <Page title="Learn To Play">
      <div className="w-80 p-4 bg-white shadow-lg border border-grey-300 rounded-xl">
        <p className="font-bold text-black text-xl mb-6">Learn To Play</p>
        <ul>
          <li className="mb-4 text-center text-sm">
            Click on the letters to link them into words. Click on submit to add
            your word score to your total score.
          </li>
          <li className="mb-4 text-center text-sm">
            The length of the word and the rarity of the letters will increase
            the overall score of your word!
          </li>
          <li className="mb-4 text-center text-sm">
            Watch out for red burning tiles, they burn the tile below them. If
            they reach the bottom its game over!
          </li>
          <li className="mb-6 text-center text-sm">
            Scrambling the board will randomize all the tiles to a new letter
            not including burning tiles. It will also give you more burning
            tiles.
          </li>
          <p className="font-bold text-center">Good Luck!</p>
        </ul>
        <button
          onClick={() => router.push("/")}
          type="button"
          className="mt-6 w-full text-white bg-[#000000] hover:bg-[#000000]/90 font-medium rounded-lg text-sm px-10 py-2.5 text-center text-center"
        >
          Back
        </button>
      </div>
    </Page>
  );
};

export default Learn;
