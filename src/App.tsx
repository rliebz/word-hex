import { useMemo, useState } from "react";

import Game, { findWords, scoreWords } from "./Game";
import dictionary from "./dictionary";
import Randomizer from "./random";

import "./App.css";

const allPangrams = dictionary.filter((word) => {
  if (["ing", "ed", "tion"].some((suffix) => word.endsWith(suffix))) {
    return false;
  }

  const set = new Set(word);
  return set.size === 7; // && findWords({ letters: [...set] }).length < 80;
});

const gameStateFromSeed = (seed: string): [string[], string] => {
  const randomizer = new Randomizer(seed);
  const pangram = randomizer.chooseFrom(allPangrams);
  const letters = randomizer.shuffle(new Set(pangram));

  const lowest = letters.reduce(
    (acc, letter) => {
      const allWords = findWords({ letters, centerLetter: letter });
      const score = scoreWords(allWords);
      if (score < acc.score) {
        return {
          letter,
          score,
        };
      }

      return acc;
    },
    {
      letter: "",
      score: Number.MAX_SAFE_INTEGER,
    },
  );

  return [letters, lowest.letter];
};

const dateAsYYYYMMDD = (date: Date): string => date.toISOString().slice(0, 10);

const App = function App() {
  const [date, setDate] = useState(new Date());
  const [letters, centerLetter] = useMemo(
    () => gameStateFromSeed(dateAsYYYYMMDD(date)),
    [date],
  );

  return (
    <div className="main">
      <div className="nav-bar">
        <h1>Word Hex</h1>
        <input
          type="date"
          value={dateAsYYYYMMDD(date)}
          onChange={(e) => {
            const selectedDate = e.target.valueAsDate;
            if (selectedDate && !Number.isNaN(selectedDate.getTime())) {
              setDate(selectedDate);
            }
          }}
        />
      </div>
      <Game letters={letters} centerLetter={centerLetter} />
    </div>
  );
};

export default App;
