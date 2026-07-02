export type GameState = "waiting" | "playing" | "won" | "lost";

export type LetterState =
  | "unknown"
  | "correctPosition"
  | "wrongPosition"
  | "notInWord";

export interface LetterPosition {
  letter: string;
  state: LetterState;
}

export interface ScoreEntry {
  id: string;
  name: string;
  score: number;
  date: string;
  word: string;
  guesses: number;
}

export interface GameData {
  currentWord: string;
  revealedLetters: Record<number, string>;
  incorrectGuesses: number;
  gameState: GameState;
  score: number;
  guessCount: number;
  wordGuesses: string[];
  wordFeedback: LetterPosition[][];
  errorMessage: string;
  hintsUsed: number;
}

export interface GuessResult {
  isValid: boolean;
  correctPositions: number;
  wrongPositions: number;
}
