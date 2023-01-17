import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Page from "../src/components/Page";
import { useRouter } from "next/router";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../src/services/firebase";
import Loader from "../src/components/Loader";
import { HighscoreSortingTypes } from "../src/types";
import HighscoreList from "../src/components/HighscoreList";
import { useSortedHighscores } from "../src/hooks/useSortedHighscores";

const Highscores: NextPage = () => {
  const router = useRouter();
  const [highscores, setHighscores] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<HighscoreSortingTypes>(
    HighscoreSortingTypes.SCORE
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "highscores"),
      (querySnapshot: any) => {
        const highscoreData: any[] = [];

        querySnapshot.forEach((doc: any) => {
          highscoreData.push(doc.data());
        });

        setHighscores(highscoreData);
      }
    );

    return () => unsubscribe();
  }, []);

  const sortedHighscores = useSortedHighscores(highscores);
  const highscoreData = sortedHighscores?.[sortBy];

  return (
    <Page title="Highscores">
      <div className="w-80 p-4 bg-white shadow-lg border border-grey-300 rounded-xl">
        <div className="flex flex-row justify-between items-center mb-4">
          <p className="font-bold text-black text-xl mb-2">Highscores</p>
          <select
            onChange={(e) => setSortBy(e.target.value as HighscoreSortingTypes)}
            id=" leaderboard"
            className="max-w-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1"
          >
            <option value={HighscoreSortingTypes.SCORE}>Score</option>
            <option value={HighscoreSortingTypes.LONGEST_WORD}>
              Longest Word
            </option>
          </select>
        </div>

        <ul>
          {!highscores.length ? (
            <div className="flex flex-col justify-center items-center h-80">
              <Loader />
            </div>
          ) : (
            <HighscoreList
              highscores={highscoreData.highscores}
              property={highscoreData.property}
            />
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
