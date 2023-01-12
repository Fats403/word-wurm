import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Page from "../src/components/Page";
import { useRouter } from "next/router";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../src/services/firebase";
import Loader from "../src/components/Loader";

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
      <div className="w-80 p-4 bg-white shadow-lg border border-grey-300 rounded-xl dark:bg-gray-700">
        <p className="font-bold text-black text-xl dark:text-white mb-2">
          Highscores
        </p>
        <ul>
          {!highscores.length ? (
            <div className="flex flex-col justify-center items-center">
              <Loader />
            </div>
          ) : (
            <div className="flex flex-col">
              {highscores?.map((data: any, index: number) => {
                if (index >= 5) return;
                return (
                  <li key={index} className="flex items-center my-2 space-x-2 ">
                    <div className="relative inline-flex items-center justify-center w-12 h-12 overflow-hidden border border-black rounded-full">
                      <span className="font-medium text-gray-600 dark:text-gray-300">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="ml-2 text-sm font-semibold text-gray-900 dark:text-white">
                        {data.displayName}
                      </span>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-300">
                        Score: {data.totalScore}
                      </span>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-300">
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
          className="mt-4 w-full text-white bg-[#000000] hover:bg-[#000000]/90 font-medium rounded-lg text-sm px-10 py-2.5 text-center text-center dark:focus:ring-[#000000]/55 mr-2 mb-2"
        >
          Back
        </button>
      </div>
    </Page>
  );
};

export default Highscores;
