import dictionary from "./dictionary";
import Randomizer from "./random";

import "./App.css";
import Game from "./Game";

const App = function App() {
  const randomizer = new Randomizer();
  const allPangrams = dictionary.filter(word => new Set(word).size === 7);
  const pangram = randomizer.chooseFrom(allPangrams);

  const letters = randomizer.shuffle(new Set(pangram));
  const centerLetter = randomizer.chooseFrom(letters);

  return <Game letters={letters} centerLetter={centerLetter} />;
};

export default App;
