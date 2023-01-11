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
    <Page title="Login">
      <div className="flex flex-col border-solid border-2 border-black rounded-lg p-6">
        <h1 className="font-bold leading-tight text-5xl mt-0 mb-2 text-black mb-4">
          HIGHSCORES
        </h1>

        {!highscores.length ? (
          <div className="flex flex-col justify-center items-center">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            {highscores?.map((data: any, index: number) => {
              if (index > 5) return;
              return (
                <div
                  key={index}
                  className="flex flex-col justify-center items-center mb-2"
                >
                  <b>
                    {index + 1}. {data.displayName}
                  </b>
                  <div>Score: {data.totalScore}</div>
                  <div>Longest Word: {data.longestWord}</div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => router.push("/")}
          type="button"
          className="mt-4 text-white bg-[#000000] hover:bg-[#000000]/90 font-medium rounded-lg text-sm px-10 py-2.5 text-center text-center dark:focus:ring-[#000000]/55 mr-2 mb-2"
        >
          Back
        </button>
      </div>
    </Page>
  );
};

export default Highscores;
