import type { ScoreEntry } from "./game-types";

const STORAGE_KEY = "wordguess-scores";
const MAX_SCORES = 10;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function loadScores(): ScoreEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const scores = JSON.parse(data) as ScoreEntry[];
    return scores.sort((a, b) => b.score - a.score);
  } catch {
    return [];
  }
}

export function addScore(name: string, score: number, word: string, guesses: number): ScoreEntry[] {
  const scores = loadScores();
  const entry: ScoreEntry = {
    id: generateId(),
    name,
    score: Math.max(0, score),
    date: new Date().toISOString(),
    word,
    guesses,
  };

  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);

  // Keep only top 10
  const trimmed = scores.slice(0, MAX_SCORES);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage full or unavailable — silently continue
  }

  return trimmed;
}

export function clearScores(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
