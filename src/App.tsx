import seedrandom from "seedrandom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import dictionary from "./dictionary";
import "./App.css";

const rng = seedrandom(new Date().toLocaleDateString("en-US"));

const allPangrams = dictionary.filter(
  word => new Set(word).size === 7 && !word.includes("s")
);

const shuffle = <T extends any>(list: T[]): T[] => {
  const output = [...list];

  for (let i = output.length - 1; i >= 0; i -= 1) {
    const j = Math.floor(rng() * output.length);
    const temp = output[i];
    output[i] = output[j];
    output[j] = temp;
  }

  return output;
};

const letters = shuffle([
  ...new Set(allPangrams[Math.floor(rng() * allPangrams.length)])
]);

const centerLetter = letters[3];

const allWords = dictionary.filter(word => {
  if (word.length < 4) {
    return false;
  }

  if (!word.includes(centerLetter)) {
    return false;
  }

  for (let i = 0; i < word.length; i += 1) {
    if (!letters.includes(word[i])) {
      return false;
    }
  }

  return true;
});

const scoreWord = (word: string): number => {
  if (word.length === 4) {
    return 1;
  }

  if (new Set(word).size === 7) {
    return word.length + 7;
  }

  return word.length;
};

const scoreWords = (words: string[]): number =>
  words.map(word => scoreWord(word)).reduce((a, b) => a + b, 0);

const maxScore = scoreWords(allWords);

const tiers = [
  { title: "Genius", score: Math.floor(maxScore * 0.7) },
  { title: "Amazing", score: Math.floor(maxScore * 0.5) },
  { title: "Great", score: Math.floor(maxScore * 0.4) },
  { title: "Nice", score: Math.floor(maxScore * 0.25) },
  { title: "Solid", score: Math.floor(maxScore * 0.15) },
  { title: "Good", score: Math.floor(maxScore * 0.08) },
  { title: "Moving Up", score: Math.floor(maxScore * 0.05) },
  { title: "Good Start", score: Math.floor(maxScore * 0.02) },
  { title: "Beginner", score: 0 }
];

const App = function App() {
  const [found, setFound] = useState<string[]>([]);
  const [attempt, setAttempt] = useState("");

  const submit = () => {
    setAttempt("");

    if (attempt.length < 4) {
      toast("Too short");
      return;
    }

    if (!attempt.includes(centerLetter)) {
      toast("Missing center letter");
      return;
    }

    if (!dictionary.includes(attempt)) {
      toast("Not a word");
      return;
    }

    if (found.includes(attempt)) {
      toast("Already found");
      return;
    }

    toast(`+${scoreWord(attempt)}!`);

    setFound([...found, attempt]);
  };

  const score = scoreWords(found);

  let title = "Beginner";
  for (const tier of tiers) {
    if (score > tier.score) {
      title = tier.title;
      break;
    }
  }

  return (
    <div className="main">
      <div className="attempt">
        {[...attempt].map(letter =>
          letter === centerLetter ? (
            <span className="center-letter">{letter}</span>
          ) : (
            letter
          )
        )}
        <span className="blinker">|</span>
      </div>

      <div className="hex-grid">
        {letters.map(letter => (
          <button
            type="button"
            key={letter}
            onClick={() => setAttempt(attempt + letter)}
          >
            {letter}
          </button>
        ))}
      </div>
      <div className="button-group">
        <button type="button" onClick={() => setAttempt("")}>
          Clear
        </button>
        <button
          type="button"
          onClick={() => setAttempt(attempt.slice(0, attempt.length - 1))}
        >
          Delete
        </button>
        <button type="button" onClick={submit}>
          Enter
        </button>
      </div>

      <div>
        Score: {score} ({title})
      </div>

      <div>Found:</div>
      <ul>
        {found.map(word => (
          <li key={word}>{word}</li>
        ))}
      </ul>
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default App;
