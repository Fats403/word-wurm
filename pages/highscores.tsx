import { NextPage } from "next";
import React from "react";
import Page from "../src/components/Page";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../src/services/firebase";

export async function getStaticProps() {
  const snapshot = await getDocs(collection(firestore, "highscores"));
  const highscores = snapshot.docs.map((doc) => doc.data());
  const sortedHighscores = highscores.sort((a, b) => {
    return b.totalScore - a.totalScore;
  });

  return {
    props: {
      highscores: sortedHighscores,
    },
  };
}

const Highscores: NextPage = ({ highscores }: any) => {
  const router = useRouter();

  return (
    <Page title="Login">
      <div className="flex flex-col border-solid border-2 border-black rounded-lg p-6">
        <h1 className="font-bold leading-tight text-5xl mt-0 mb-2 text-black mb-4">
          HIGHSCORES
        </h1>
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
                <div key={index}>Score: {data.totalScore}</div>
                <div key={index}>Longest Word: {data.longestWord}</div>
              </div>
            );
          })}
        </div>
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
