import dictionary from "./dictionary";
import Randomizer from "./random";

import "./App.css";
import Game from "./Game";

const App = function App() {
  const randomizer = new Randomizer();
  const allPangrams = dictionary.filter(word => new Set(word).size === 7);

  return (
    <Game
      randomizer={randomizer}
      pangram={randomizer.chooseFrom(allPangrams)}
    />
  );
};

export default App;
