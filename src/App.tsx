import seedrandom from "seedrandom";
import { useEffect, useState } from "react";
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

  if ([...word].some(letter => !letters.includes(letter))) {
    return false;
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

const storageKey = `${centerLetter}:${[...letters].sort().join("")}:found`;

const App = function App() {
  const loadedData = JSON.parse(localStorage.getItem(storageKey) || "null");
  const [found, setFound] = useState<string[]>(loadedData || []);
  const [attempt, setAttempt] = useState("");

  const backspace = (word: string) =>
    setAttempt(word.slice(0, word.length - 1));

  const submit = (word: string) => {
    setAttempt("");

    const throwError = (message: string) => toast(message, { type: "error" });

    if (word.length < 4) {
      throwError("Too short");
      return;
    }

    if (!word.includes(centerLetter)) {
      throwError("Missing center letter");
      return;
    }

    if (found.includes(word)) {
      throwError("Already found");
      return;
    }

    if ([...word].some(letter => !letters.includes(letter))) {
      throwError("Bad letters");
      return;
    }

    if (!dictionary.includes(word)) {
      throwError("Not a word");
      return;
    }

    toast(`+${scoreWord(word)}!`, { type: "success" });

    const newlyFound = [...found, word];
    setFound(newlyFound);
    localStorage.setItem(storageKey, JSON.stringify(newlyFound));
  };

  useEffect(
    () => {
      const handleKeydown = (event: KeyboardEvent) => {
        if (event.metaKey || event.altKey || event.shiftKey || event.ctrlKey) {
          return;
        }

        event.preventDefault();

        if (event.key === "Enter") {
          submit(attempt);
          return;
        }

        if (event.key === "Backspace") {
          backspace(attempt);
          return;
        }

        setAttempt(attempt + event.key);
      };

      document.addEventListener("keydown", handleKeydown);
      return () => document.removeEventListener("keydown", handleKeydown);
    },
    [attempt]
  );

  const score = scoreWords(found);

  let title = "Beginner";
  for (const tier of tiers) {
    if (score >= tier.score) {
      title = tier.title;
      break;
    }
  }

  return (
    <div className="main">
      <h1>Word Hex</h1>
      <div className="attempt">
        {[...attempt].map(letter => (
          <span
            key={letter}
            className={
              letter === centerLetter
                ? "center-letter"
                : !letters.includes(letter)
                ? "bad-letter"
                : undefined
            }
          >
            {letter}
          </span>
        ))}
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
        <button type="button" onClick={() => backspace(attempt)}>
          Delete
        </button>
        <button type="button" onClick={() => submit(attempt)}>
          Enter
        </button>
      </div>

      <div>
        Score: {score} ({title}!)
      </div>

      <div className="info-group">
        <div>
          <ul>
            {[...tiers].reverse().map(tier => (
              <li
                key={tier.title}
                className={score >= tier.score ? "achieved" : undefined}
              >
                {tier.title} ({tier.score})
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ul>
            {[...found].sort().map(word => (
              <li key={word}>{word}</li>
            ))}
          </ul>
        </div>
      </div>
      <ToastContainer autoClose={2000} position="top-left" />
    </div>
  );
};

export default App;
