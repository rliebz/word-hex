import { useCallback, useEffect, useMemo, useState } from "react";
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

const alphabet = new Set([..."abcdefghijklmnopqrstuvwxyz"]);

export const findWords = ({
	letters,
	centerLetter,
}: {
	letters: string[];
	centerLetter?: string;
}) =>
	dictionary.filter((word) => {
		if (centerLetter && !word.includes(centerLetter)) {
			return false;
		}

		if ([...new Set(word)].some((letter) => !letters.includes(letter))) {
			return false;
		}

		return true;
	});

export const scoreWords = (words: string[]): number =>
	words.map((word) => scoreWord(word)).reduce((a, b) => a + b, 0);

interface GameProps {
	centerLetter: string;
	letters: string[];
}

const loadData = (key: string) =>
	JSON.parse(localStorage.getItem(key) || "null") || [];

const Game = function Game({ letters, centerLetter }: GameProps) {
	const storageKey = useMemo(
		() => `${centerLetter}:${[...letters].sort().join("")}:found`,
		[centerLetter, letters],
	);

	const [found, setFound] = useState<string[]>(loadData(storageKey));

	useEffect(() => {
		setFound(loadData(storageKey));
	}, [storageKey]);

	const [seed, setSeed] = useState(new Date().toLocaleString("en-US"));

	const orderedLetters = useMemo(() => {
		const randomizer = new Randomizer(seed);
		return randomizer.shuffleAround(letters, centerLetter);
	}, [centerLetter, letters, seed]);

	const [attempt, setAttempt] = useState("");

	const allWords = useMemo(
		() => findWords({ centerLetter, letters }),
		[centerLetter, letters],
	);

	const score = useMemo(() => scoreWords(found), [found]);
	const maxScore = useMemo(() => scoreWords(allWords), [allWords]);

	const tiers = useMemo(
		() => [
			{ title: "Genius", score: Math.floor(maxScore * 0.7) },
			{ title: "Amazing", score: Math.floor(maxScore * 0.5) },
			{ title: "Great", score: Math.floor(maxScore * 0.4) },
			{ title: "Nice", score: Math.floor(maxScore * 0.25) },
			{ title: "Solid", score: Math.floor(maxScore * 0.15) },
			{ title: "Good", score: Math.floor(maxScore * 0.08) },
			{ title: "Moving Up", score: Math.floor(maxScore * 0.05) },
			{ title: "Good Start", score: Math.floor(maxScore * 0.02) },
			{ title: "Beginner", score: 0 },
		],
		[maxScore],
	);

	const backspace = useCallback(
		(word: string) => setAttempt(word.slice(0, word.length - 1)),
		[],
	);

	const submit = useCallback(
		(word: string) => {
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

			if ([...word].some((letter) => !letters.includes(letter))) {
				throwError("Bad letters");
				return;
			}

			if (!dictionary.includes(word)) {
				throwError("Not a word");
				return;
			}

			toast(
				`${new Set(word).size === 7 ? "Pangram! " : ""}+${scoreWord(word)}!`,
				{ type: "success" },
			);

			const newlyFound = [...found, word].sort();
			setFound(newlyFound);
			localStorage.setItem(storageKey, JSON.stringify(newlyFound));
		},
		[centerLetter, letters, found, storageKey],
	);

	useEffect(() => {
		const handleKeydown = (event: KeyboardEvent) => {
			if (event.metaKey || event.altKey || event.shiftKey || event.ctrlKey) {
				return;
			}

			if (event.key === "Enter") {
				event.preventDefault();
				submit(attempt);
				return;
			}

			if (event.key === "Backspace") {
				event.preventDefault();
				backspace(attempt);
				return;
			}

			if (!alphabet.has(event.key)) {
				return;
			}

			event.preventDefault();
			setAttempt(attempt + event.key);
		};

		document.addEventListener("keydown", handleKeydown);
		return () => document.removeEventListener("keydown", handleKeydown);
	}, [attempt, backspace, submit]);

	const title = useMemo(
		() => tiers.find((tier) => score >= tier.score)?.title ?? "",
		[tiers, score],
	);

	return (
		<>
			<div className="attempt">
				{[...attempt].map((letter, i) => (
					<span
						/* biome-ignore lint/suspicious/noArrayIndexKey: The order never changes, so
						 * indexes are semantic and appropriate. */
						key={i}
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
				{orderedLetters.map((letter) => (
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
				<span className="button-group">
					<button
						type="button"
						onClick={() => setSeed(Math.random().toString())}
					>
						Shuffle
					</button>
					<button type="button" onClick={() => setAttempt("")}>
						Clear
					</button>
				</span>
				<span className="button-group">
					<button type="button" onClick={() => backspace(attempt)}>
						Delete
					</button>
					<button type="button" onClick={() => submit(attempt)}>
						Enter
					</button>
				</span>
			</div>

			<div>
				Score: {score} ({title}!)
			</div>

			<div className="info-group">
				<div>
					<ul>
						{[...tiers].reverse().map((tier) => (
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
						{found.map((word) => (
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
