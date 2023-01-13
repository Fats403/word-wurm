import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Page from "../src/components/Page";
import { useRouter } from "next/router";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../src/services/firebase";
import Loader from "../src/components/Loader";

const top3Colors: any = {
  0: "#d4af37",
  1: "#c0c0c0",
  2: "#cd7f32",
};

const Highscores: NextPage = () => {
  const router = useRouter();
  const [highscores, setHighscores] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "highscores"),
      (querySnapshot: any) => {
        const highscoreData: any[] = [];

        querySnapshot.forEach((doc: any) => {
          highscoreData.push(doc.data());
        });

        const sortedHighscores = highscoreData.sort((a, b) => {
          return b.totalScore - a.totalScore;
        });

        setHighscores(sortedHighscores);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <Page title="Highscores">
      <div className="w-80 p-4 bg-white shadow-lg border border-grey-300 rounded-xl">
        <p className="font-bold text-black text-xl mb-4">Highscores</p>
        {/*<div className="flex flex-row justify-between items-center mb-4">
          <p className="font-bold text-black text-xl mb-2">Highscores</p>
          <select
            id=" leaderboard"
            className="max-w-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1"
          >
            <option value="US">Score</option>
            <option value="CA">Longest Word</option>
          </select>
        </div>*/}

        <ul>
          {!highscores.length ? (
            <div className="flex flex-col justify-center items-center h-80">
              <Loader />
            </div>
          ) : (
            <div className="flex flex-col overflow-auto h-80">
              {highscores?.map((data: any, index: number) => {
                if (index > 10) return;
                return (
                  <li key={index} className="flex items-center my-2 space-x-2 ">
                    <div
                      style={{
                        backgroundColor: top3Colors[index]
                          ? top3Colors[index]
                          : "white",
                      }}
                      className="relative inline-flex items-center justify-center w-12 h-12 overflow-hidden border-2 border-black rounded-full"
                    >
                      <span className="font-bold text-black select-none">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="ml-2 text-sm font-semibold text-gray-900">
                        {data.displayName}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        Score: {data.totalScore}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        Longest Word: {data.longestWord}
                      </span>
                    </div>
                  </li>
                );
              })}
            </div>
          )}
        </ul>
        <button
          onClick={() => router.push("/")}
          type="button"
          className="mt-4 w-full text-white bg-[#000000] hover:bg-[#000000]/90 font-medium rounded-lg text-sm px-10 py-2.5 text-center text-center"
        >
          Back
        </button>
      </div>
    </Page>
  );
};

export default Highscores;
