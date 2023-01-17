import { useEffect, useMemo, useState } from "react";
import { HighscoreSortingTypes } from "../types";

export const useSortedHighscores = (highscores: any) => {
  const [sortedByScore, setSortedByScore] = useState<any[]>([]);
  const [sortedByLongestWord, setSortedByLongestWord] = useState<any[]>([]);

  useEffect(() => {
    const scoreSort = [...highscores];
    const longestWordSort = [...highscores];

    scoreSort.sort((a, b) => {
      return b.totalScore - a.totalScore;
    });

    longestWordSort.sort((a, b) => {
      return b.longestWord.length - a.longestWord.length;
    });

    setSortedByScore(scoreSort);
    setSortedByLongestWord(longestWordSort);
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
    }),
    [sortedByLongestWord, sortedByScore]
  );

  return sortedHighscores;
};
