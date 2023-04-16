import { useMemo, useState } from "react";

import Game from "./Game";
import dictionary from "./dictionary";
import Randomizer from "./random";

import "./App.css";

const allPangrams = dictionary.filter((word) => new Set(word).size === 7);

const gameStateFromSeed = (seed: string): [string[], string] => {
  const randomizer = new Randomizer(seed);
  const pangram = randomizer.chooseFrom(allPangrams);
  const letters = randomizer.shuffle(new Set(pangram));
  const centerLetter = randomizer.chooseFrom(letters);

  return [letters, centerLetter];
};

const dateAsYYYYMMDD = (date: Date): string => date.toISOString().slice(0, 10);

const App = function App() {
  const [date, setDate] = useState(new Date());
  const [letters, centerLetter] = useMemo(
    () => gameStateFromSeed(dateAsYYYYMMDD(date)),
    [date]
  );

  return (
    <div className="main">
      <div className="nav-bar">
        <h1>Word Hex</h1>
        <input
          type="date"
          value={dateAsYYYYMMDD(date)}
          onChange={(e) => {
            if (e.target.valueAsDate) {
              setDate(e.target.valueAsDate);
            }
          }}
        />
      </div>
      <Game letters={letters} centerLetter={centerLetter} />
    </div>
  );
};

export default App;
