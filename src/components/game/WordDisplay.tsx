import { memo } from "react";

interface WordDisplayProps {
  letters: string[];
}

/** Current word with revealed letters and blanks — cohesive glass card style */
const WordDisplay = memo(function WordDisplay({ letters }: WordDisplayProps) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/80 shadow-sm">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">
        Current Word
      </p>
      <div className="flex gap-3 justify-center">
        {letters.map((letter, index) => (
          <div
            key={index}
            className={`
              w-14 h-16 flex items-center justify-center rounded-xl text-2xl font-black
              border-2 transition-all duration-300
              ${
                letter !== "_"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm shadow-emerald-100"
                  : "bg-white border-gray-200 text-gray-300"
              }
            `}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
});

export default WordDisplay;
