import { useState } from "react";

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

const App = function App() {
  // TODO: Allow dates to be set
  const [date] = useState(new Date());
  const [todaysLetters, todaysCenterLetter] = gameStateFromSeed(
    date.toLocaleDateString("en-US")
  );

  const [letters] = useState(todaysLetters);
  const [centerLetter] = useState(todaysCenterLetter);

  return (
    <div className="main">
      <div className="nav-bar">
        <h1>Word Hex</h1>
      </div>
      <Game letters={letters} centerLetter={centerLetter} />
    </div>
  );
};

export default App;
