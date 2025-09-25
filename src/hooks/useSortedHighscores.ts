import { useEffect, useMemo, useState } from "react";
import { HighscoreSortingTypes } from "../types";

export const useSortedHighscores = (highscores: any) => {
  const [sortedByScore, setSortedByScore] = useState<any[]>([]);
  const [sortedByLongestWord, setSortedByLongestWord] = useState<any[]>([]);
  const [sortedByBestWordScore, setSortedByBestWordScore] = useState<any[]>([]);

  useEffect(() => {
    const scoreSort = highscores.filter(
      (h: any) => typeof h.totalScore === "number"
    );
    const longestWordSort = highscores.filter(
      (h: any) => typeof h.longestWord === "string" && h.longestWord.length > 0
    );
    const bestWordScoreSort = highscores.filter(
      (h: any) => typeof h.bestWordScore === "number" && h.bestWordScore > 0
    );

    scoreSort.sort((a: any, b: any) => {
      return b.totalScore - a.totalScore;
    });

    longestWordSort.sort((a: any, b: any) => {
      return b.longestWord.length - a.longestWord.length;
    });

    bestWordScoreSort.sort((a: any, b: any) => {
      const aScore = typeof a.bestWordScore === "number" ? a.bestWordScore : 0;
      const bScore = typeof b.bestWordScore === "number" ? b.bestWordScore : 0;
      return bScore - aScore;
    });

    setSortedByScore(scoreSort);
    setSortedByLongestWord(longestWordSort);
    setSortedByBestWordScore(bestWordScoreSort);
  }, [highscores]);

  const sortedHighscores = useMemo(
    () => ({
      [HighscoreSortingTypes.SCORE]: {
        property: "totalScore",
        highscores: sortedByScore,
      },
      [HighscoreSortingTypes.LONGEST_WORD]: {
        property: "longestWord",
        highscores: sortedByLongestWord,
      },
      [HighscoreSortingTypes.WORD_SCORE]: {
        property: "bestWordScore",
        highscores: sortedByBestWordScore,
      },
    }),
    [sortedByLongestWord, sortedByScore, sortedByBestWordScore]
  );

  return sortedHighscores;
};
