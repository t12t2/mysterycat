import { memo, useCallback } from "react";
import type { LetterState } from "@/lib/game-types";

interface GameKeyboardProps {
  letterStates: Record<string, LetterState>;
  onKeyPress: (letter: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

function keyColor(state: LetterState | undefined): string {
  switch (state) {
    case "correctPosition":
      return "bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-600 shadow-sm shadow-emerald-200";
    case "wrongPosition":
      return "bg-rose-500 text-white hover:bg-rose-600 border-rose-600 shadow-sm shadow-rose-200";
    case "notInWord":
      return "bg-gray-300 text-white hover:bg-gray-400 border-gray-400";
    default:
      return "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 shadow-sm";
  }
}

/** On-screen keyboard — cohesive with glass cards */
const GameKeyboard = memo(function GameKeyboard({
  letterStates,
  onKeyPress,
  onDelete,
  onSubmit,
  disabled,
}: GameKeyboardProps) {
  const handleKey = useCallback(
    (letter: string) => {
      if (!disabled) onKeyPress(letter);
    },
    [disabled, onKeyPress],
  );

  return (
    <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-3 border border-white/60">
      <div className="flex flex-col gap-1.5 items-center">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center w-full">
            {rowIndex === 2 && (
              <button
                onClick={onSubmit}
                disabled={disabled}
                className="px-3 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold
                  hover:from-blue-600 hover:to-purple-700 border border-blue-600 transition-all shadow-sm
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ENTER
              </button>
            )}
            {row.map((letter) => (
              <button
                key={letter}
                onClick={() => handleKey(letter)}
                disabled={disabled}
                className={`
                  w-9 h-11 sm:w-10 sm:h-12 rounded-lg text-sm font-bold border
                  transition-all duration-200 active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${keyColor(letterStates[letter])}
                `}
              >
                {letter}
              </button>
            ))}
            {rowIndex === 2 && (
              <button
                onClick={onDelete}
                disabled={disabled}
                className="px-3 py-3 rounded-lg bg-amber-500 text-white text-xs font-bold
                  hover:bg-amber-600 border border-amber-600 transition-all shadow-sm
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                DEL
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default GameKeyboard;
