import { memo } from "react";

interface GameHeaderProps {
  score: number;
  guessCount: number;
  incorrectGuesses: number;
}

/** Compact score HUD with cohesive pill design */
const GameHeader = memo(function GameHeader({
  score,
  guessCount,
  incorrectGuesses,
}: GameHeaderProps) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 border border-white/80 shadow-sm">
      <div className="flex items-center justify-around gap-2">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Score</span>
          <span className="text-2xl font-black text-blue-600">{Math.max(0, score)}</span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Guesses</span>
          <span className="text-2xl font-black text-purple-600">{guessCount}<span className="text-sm font-bold text-purple-300">/6</span></span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Wrong</span>
          <span className="text-2xl font-black text-rose-500">{incorrectGuesses}<span className="text-sm font-bold text-rose-300">/6</span></span>
        </div>
      </div>
    </div>
  );
});

export default GameHeader;
