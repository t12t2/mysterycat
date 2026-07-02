import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WinOverlayProps {
  score: number;
  word: string;
  guesses: number;
  onSaveScore: (name: string) => void;
  onSkip: () => void;
}

export function WinOverlay({ score, word, guesses, onSaveScore, onSkip }: WinOverlayProps) {
  const [name, setName] = useState("");

  const handleSave = useCallback(() => {
    if (name.trim()) {
      onSaveScore(name.trim());
    }
  }, [name, onSaveScore]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && name.trim()) {
        handleSave();
      }
    },
    [name, handleSave],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl animate-in zoom-in-95 duration-300 border border-emerald-100">
        <div className="text-5xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-2">
          YOU WON!
        </h2>
        <p className="text-gray-600 mb-1">
          You guessed <span className="font-bold text-gray-800">{word}</span>
        </p>
        <p className="text-gray-600 mb-1">
          in <span className="font-bold">{guesses}</span> guess{guesses !== 1 ? "es" : ""}
        </p>
        <div className="flex items-center justify-center gap-2 my-4">
          <span className="text-lg text-gray-500">Score:</span>
          <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {Math.max(0, score)}
          </span>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your name..."
            className="text-center text-lg font-semibold bg-gray-50 border-gray-200"
            maxLength={20}
            autoFocus
          />
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg py-5 shadow-sm"
          >
            Save Score
          </Button>
          <button
            onClick={onSkip}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

interface LoseOverlayProps {
  word: string;
  score: number;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
}

export function LoseOverlay({ word, score, onPlayAgain, onViewLeaderboard }: LoseOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl animate-in zoom-in-95 duration-300 border border-rose-100">
        <div className="text-5xl mb-4">😿</div>
        <h2 className="text-3xl font-black text-rose-600 mb-2">Game Over</h2>
        <p className="text-gray-600 mb-1">
          The word was <span className="font-bold text-gray-800">{word}</span>
        </p>
        <div className="flex items-center justify-center gap-2 my-4">
          <span className="text-lg text-gray-500">Final Score:</span>
          <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {Math.max(0, score)}
          </span>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={onPlayAgain}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg py-5 shadow-sm"
          >
            Play Again
          </Button>
          <Button onClick={onViewLeaderboard} variant="outline" className="font-bold border-2">
            View Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
}
