import type { GameData, GameState, GuessResult, LetterPosition, LetterState } from "./game-types";
import { SECRET_WORDS_CANDIDATES } from "./secret-words";
import { VALID_WORDS_AF } from "./valid-words-a-f";
import { VALID_WORDS_GM } from "./valid-words-g-m";
import { VALID_WORDS_NZ } from "./valid-words-n-z";

const MAX_HINTS = 4;
const MAX_GUESSES = 6;

// Build the valid words set once (union of secret words + all valid word lists)
const VALID_WORDS_SET: Set<string> = new Set([
  ...SECRET_WORDS_CANDIDATES,
  ...VALID_WORDS_AF,
  ...VALID_WORDS_GM,
  ...VALID_WORDS_NZ,
]);

// Filter secret words to only those in the valid dictionary
const SECRET_WORDS = SECRET_WORDS_CANDIDATES.filter((w) => VALID_WORDS_SET.has(w));

function randomWord(): string {
  return SECRET_WORDS[Math.floor(Math.random() * SECRET_WORDS.length)] ?? "CRANE";
}

export function createInitialGameData(): GameData {
  return {
    currentWord: "",
    revealedLetters: {},
    incorrectGuesses: 0,
    gameState: "waiting",
    score: 0,
    guessCount: 0,
    wordGuesses: [],
    wordFeedback: [],
    errorMessage: "",
    hintsUsed: 0,
  };
}

export function startNewGame(): GameData {
  return {
    currentWord: randomWord(),
    revealedLetters: {},
    incorrectGuesses: 0,
    gameState: "playing",
    score: 0,
    guessCount: 0,
    wordGuesses: [],
    wordFeedback: [],
    errorMessage: "",
    hintsUsed: 0,
  };
}

export function getDisplayWord(game: GameData): string[] {
  return game.currentWord.split("").map((letter, index) => {
    return game.revealedLetters[index] ?? "_";
  });
}

export function isWordComplete(game: GameData): boolean {
  return Object.keys(game.revealedLetters).length === game.currentWord.length;
}

function isValidWord(word: string): boolean {
  return VALID_WORDS_SET.has(word);
}

export function applyHint(game: GameData): GameData {
  if (game.hintsUsed >= MAX_HINTS) return game;
  if (game.gameState !== "playing") return game;

  const newGame = { ...game, revealedLetters: { ...game.revealedLetters } };
  const hintNumber = game.hintsUsed + 1;

  // Calculate penalty
  const penalties = [5, 10, 15, 20];
  const penalty = penalties[game.hintsUsed] ?? 0;
  newGame.score = game.score - penalty;

  // Find unrevealed indices
  const unrevealedIndices: number[] = [];
  for (let i = 0; i < game.currentWord.length; i++) {
    if (game.revealedLetters[i] === undefined) {
      unrevealedIndices.push(i);
    }
  }

  // If only 1 letter remains, reveal it but count as a loss (can't win by hints alone)
  if (unrevealedIndices.length <= 1) {
    // Reveal all remaining letters
    for (const idx of unrevealedIndices) {
      newGame.revealedLetters[idx] = game.currentWord[idx]!;
    }
    newGame.hintsUsed = hintNumber;
    newGame.gameState = "lost";
    return newGame;
  }

  // Reveal a random unrevealed letter
  const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)]!;
  const letter = game.currentWord[randomIndex]!;
  newGame.revealedLetters[randomIndex] = letter;

  // After revealing, check if only 0 unrevealed remain — hints completed the word = loss
  if (Object.keys(newGame.revealedLetters).length === game.currentWord.length) {
    newGame.hintsUsed = hintNumber;
    newGame.gameState = "lost";
    return newGame;
  }

  newGame.hintsUsed = hintNumber;
  return newGame;
}

export function makeGuess(game: GameData, word: string): { game: GameData; result: GuessResult } {
  const upperWord = word.toUpperCase();
  const newGame: GameData = {
    ...game,
    revealedLetters: { ...game.revealedLetters },
    wordGuesses: [...game.wordGuesses],
    wordFeedback: [...game.wordFeedback],
    errorMessage: "",
  };

  // Validate length
  if (upperWord.length !== 5) {
    newGame.errorMessage = "Word must be 5 letters";
    return { game: newGame, result: { isValid: false, correctPositions: 0, wrongPositions: 0 } };
  }

  // Validate word exists
  if (!isValidWord(upperWord)) {
    newGame.errorMessage = "Not a valid word";
    return { game: newGame, result: { isValid: false, correctPositions: 0, wrongPositions: 0 } };
  }

  // Check revealed letters are maintained
  for (const [posStr, revealedLetter] of Object.entries(game.revealedLetters)) {
    const pos = Number(posStr);
    if (pos < upperWord.length && upperWord[pos] !== revealedLetter) {
      newGame.errorMessage = "Must keep revealed letters in their positions";
      return { game: newGame, result: { isValid: false, correctPositions: 0, wrongPositions: 0 } };
    }
  }

  // Increment guess count
  newGame.guessCount = game.guessCount + 1;
  newGame.wordGuesses.push(upperWord);

  // Exact match
  if (upperWord === game.currentWord) {
    for (let i = 0; i < game.currentWord.length; i++) {
      newGame.revealedLetters[i] = game.currentWord[i]!;
    }
    const pointsPerLetter = Math.max(0, 6 - newGame.guessCount);
    newGame.score += game.currentWord.length * pointsPerLetter + 5;
    newGame.gameState = "won";

    const feedback: LetterPosition[] = game.currentWord
      .split("")
      .map((letter) => ({ letter, state: "correctPosition" as LetterState }));
    newGame.wordFeedback.push(feedback);

    return {
      game: newGame,
      result: { isValid: true, correctPositions: game.currentWord.length, wrongPositions: 0 },
    };
  }

  // Evaluate guess
  const secretArr = game.currentWord.split("");
  const guessArr = upperWord.split("");
  const feedback: LetterPosition[] = guessArr.map((letter) => ({
    letter,
    state: "unknown" as LetterState,
  }));

  // Count available secret letters
  const available: Record<string, number> = {};
  for (const letter of secretArr) {
    available[letter] = (available[letter] ?? 0) + 1;
  }

  let correctPositions = 0;
  let wrongPositions = 0;

  // First pass: correct positions (green)
  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] === secretArr[i]) {
      feedback[i] = { letter: guessArr[i]!, state: "correctPosition" };
      newGame.revealedLetters[i] = guessArr[i]!;
      available[guessArr[i]!]!--;
      correctPositions++;
    }
  }

  // Second pass: wrong positions (red) and not in word (gray)
  for (let i = 0; i < guessArr.length; i++) {
    if (feedback[i]!.state === "unknown") {
      const letter = guessArr[i]!;
      if ((available[letter] ?? 0) > 0) {
        feedback[i] = { letter, state: "wrongPosition" };
        available[letter]!--;
        wrongPositions++;
      } else {
        feedback[i] = { letter, state: "notInWord" };
      }
    }
  }

  newGame.wordFeedback.push(feedback);

  // Score for correct positions
  const pointsPerLetter = Math.max(0, 6 - newGame.guessCount);
  newGame.score += correctPositions * pointsPerLetter;

  // Check win condition (all letters revealed)
  if (Object.keys(newGame.revealedLetters).length === game.currentWord.length) {
    newGame.score += 5;
    newGame.gameState = "won";
  } else {
    newGame.incorrectGuesses++;
    if (newGame.guessCount >= MAX_GUESSES) {
      newGame.gameState = "lost";
    }
  }

  return {
    game: newGame,
    result: { isValid: true, correctPositions, wrongPositions },
  };
}

/** Reveal the full word — player gives up; counts as a loss */
export function revealWord(game: GameData): GameData {
  if (game.gameState !== "playing") return game;

  const newGame = { ...game, revealedLetters: { ...game.revealedLetters } };

  // Reveal all letters
  for (let i = 0; i < game.currentWord.length; i++) {
    newGame.revealedLetters[i] = game.currentWord[i]!;
  }

  newGame.score = Math.max(0, game.score - 25); // heavy penalty for giving up
  newGame.gameState = "lost";
  return newGame;
}

/** Get the best known state for each letter across all guesses */
export function getKeyboardLetterStates(game: GameData): Record<string, LetterState> {
  const states: Record<string, LetterState> = {};

  for (const feedback of game.wordFeedback) {
    for (const lp of feedback) {
      const letter = lp.letter;
      const current = states[letter];

      // Priority: correctPosition > wrongPosition > notInWord
      if (lp.state === "correctPosition") {
        states[letter] = "correctPosition";
      } else if (lp.state === "wrongPosition" && current !== "correctPosition") {
        states[letter] = "wrongPosition";
      } else if (
        lp.state === "notInWord" &&
        current !== "correctPosition" &&
        current !== "wrongPosition"
      ) {
        states[letter] = "notInWord";
      }
    }
  }

  return states;
}
