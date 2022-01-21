import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import dictionary from "./dictionary";
import Randomizer from "./random";

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

interface GameProps {
  centerLetter: string;
  letters: string[];
}

const loadData = (key: string) =>
  JSON.parse(localStorage.getItem(key) || "null") || [];

const Game = function Game({ letters, centerLetter }: GameProps) {
  const storageKey = `${centerLetter}:${[...letters].sort().join("")}:found`;

  const [found, setFound] = useState<string[]>(loadData(storageKey));

  useEffect(
    () => {
      setFound(loadData(storageKey));
    },
    [letters, centerLetter]
  );

  const [seed, setSeed] = useState(new Date().toLocaleString("en-US"));
  const randomizer = new Randomizer(seed);
  const orderedLetters = randomizer.shuffleAround(letters, centerLetter);

  const [attempt, setAttempt] = useState("");

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

    toast(
      `${new Set(word).size === 7 ? "Pangram! " : ""}+${scoreWord(word)}!`,
      { type: "success" }
    );

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
    <>
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
        {orderedLetters.map(letter => (
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
        <button type="button" onClick={() => setSeed(Math.random().toString())}>
          Shuffle
        </button>
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
                className={score >= tier.score ? "achieved" : "unachieved"}
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
    </>
  );
};

export default Game;
