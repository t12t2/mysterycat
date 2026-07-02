import { memo } from "react";
import type { LetterPosition, LetterState } from "@/lib/game-types";

interface GuessFeedbackProps {
  feedback: LetterPosition[][];
}

function letterStateColor(state: LetterState): string {
  switch (state) {
    case "correctPosition":
      return "bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-200";
    case "wrongPosition":
      return "bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-200";
    case "notInWord":
      return "bg-gray-300 text-white border-gray-400";
    default:
      return "bg-gray-100 text-gray-500 border-gray-200";
  }
}

const GuessFeedback = memo(function GuessFeedback({ feedback }: GuessFeedbackProps) {
  if (feedback.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Previous Guesses
      </p>
      {feedback.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 justify-center">
          {row.map((lp, colIndex) => (
            <div
              key={colIndex}
              className={`
                w-11 h-11 flex items-center justify-center rounded-lg text-sm font-bold
                border transition-all duration-300
                ${letterStateColor(lp.state)}
              `}
            >
              {lp.letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

export default GuessFeedback;
