import { NextPage } from "next";
import React, { useContext } from "react";
import Page from "../src/components/Page";
import { useRouter } from "next/router";
import {
  FirebaseContext,
  FirebaseContextState,
} from "../src/contexts/FirebaseContext";
import MenuButton from "../src/components/MenuButton";
import GoogleButton from "../src/components/GoogleButton";

const Login: NextPage = () => {
  const router = useRouter();
  const { user } = useContext(FirebaseContext) as FirebaseContextState;

  return (
    <Page title="Login">
      <div className="flex flex-col justify-center items-center">
        <WordWurmTitle />

        <div className="flex flex-col justify-center w-64 space-y-5">
          <MenuButton
            title={user ? "PLAY" : "PLAY AS GUEST"}
            onClick={() => router.push("/play")}
          />

          <GoogleButton />

          <MenuButton
            title="VIEW HIGHSCORES"
            onClick={() => router.push("/highscores")}
          />

          <MenuButton
            title="LEARN TO PLAY"
            onClick={() => router.push("/learn")}
          />
        </div>
      </div>
    </Page>
  );
};

const WordWurmTitle = () => (
  <div className="flex flex-row items-center justify-center mb-12 select-none">
    <div className="flex flex-row p-2 text-6xl font-bold border-b-8 text-white select-none">
      W
    </div>
    <div className="relative ml-6 flex flex-row text-4xl font-semibold text-white select-none">
      WORD WURM
    </div>
  </div>
);

export default Login;
