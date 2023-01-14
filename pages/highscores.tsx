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
                if (index >= 10) return;
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
                        {index === 0 ? <Crown /> : index + 1}
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

const Crown = () => (
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="1280.000000pt"
    height="815.000000pt"
    viewBox="0 0 1280.000000 815.000000"
    preserveAspectRatio="xMidYMid meet"
    className="w-6 h-6"
  >
    <g
      transform="translate(0.000000,815.000000) scale(0.100000,-0.100000)"
      fill="#000000"
      stroke="none"
    >
      <path
        d="M6224 8131 c-137 -37 -202 -83 -331 -229 -139 -159 -190 -310 -179
-527 9 -184 62 -316 185 -461 38 -44 91 -97 118 -117 55 -40 169 -97 195 -97
9 0 19 -4 22 -9 10 -16 -743 -2610 -779 -2686 -48 -100 -88 -150 -141 -176
-41 -19 -50 -20 -86 -10 -55 17 -124 88 -185 191 -27 47 -343 465 -702 929
l-652 845 46 39 c209 179 315 387 315 617 0 172 -47 303 -159 442 -132 164
-238 240 -389 279 -133 34 -263 18 -402 -49 -58 -28 -93 -55 -159 -122 -136
-139 -209 -256 -242 -390 -17 -71 -17 -249 0 -320 19 -77 81 -207 132 -276
116 -158 250 -254 404 -291 39 -9 71 -17 72 -18 3 -2 -194 -1964 -203 -2020
-12 -74 -54 -192 -84 -233 -75 -104 -178 -97 -335 23 -38 29 -385 259 -770
510 -385 251 -706 463 -713 470 -11 10 -8 21 22 63 142 197 175 498 79 726
-83 199 -274 374 -468 432 -73 21 -217 24 -295 5 -30 -7 -93 -31 -140 -53 -71
-35 -100 -56 -180 -137 -74 -74 -105 -115 -137 -176 -68 -131 -78 -178 -78
-355 0 -135 3 -165 24 -230 98 -314 354 -513 661 -513 109 -1 171 15 268 68
35 20 65 35 67 33 5 -7 275 -516 383 -723 327 -629 481 -1071 562 -1610 6 -38
13 -82 16 -98 l6 -27 4398 0 4397 0 7 52 c12 95 76 400 112 535 77 294 201
611 374 962 103 209 458 890 471 905 4 5 21 -1 37 -13 80 -56 244 -98 346 -87
174 20 302 81 426 206 47 47 100 111 119 142 197 336 129 725 -172 978 -77 65
-183 121 -267 141 -71 17 -200 17 -270 0 -127 -31 -278 -131 -375 -249 -124
-150 -172 -298 -162 -504 7 -163 52 -301 134 -416 25 -36 30 -49 20 -58 -6 -6
-330 -218 -718 -471 -388 -254 -737 -485 -775 -514 -89 -67 -137 -89 -200 -89
-94 0 -157 69 -194 214 -14 57 -48 371 -115 1089 -52 555 -95 1013 -95 1018 0
5 7 9 14 9 38 0 179 54 233 89 118 76 246 231 299 363 69 168 72 395 7 558
-39 98 -87 165 -193 271 -107 107 -188 155 -315 185 -135 31 -299 2 -432 -78
-70 -42 -202 -174 -258 -258 -147 -223 -146 -563 4 -792 49 -76 137 -171 206
-225 l40 -30 -31 -39 c-288 -365 -1292 -1681 -1329 -1743 -56 -93 -138 -175
-185 -184 -77 -16 -158 60 -216 203 -12 30 -76 240 -142 465 -66 226 -238 810
-382 1300 -143 489 -258 895 -256 902 3 7 12 13 20 13 7 0 51 18 96 41 100 50
237 180 294 279 116 199 139 467 59 670 -74 188 -263 377 -432 431 -96 31
-271 36 -367 10z"
      />
      <path d="M1990 660 l0 -660 4395 0 4395 0 2 660 3 660 -4397 0 -4398 0 0 -660z" />
    </g>
  </svg>
);

export default Highscores;
