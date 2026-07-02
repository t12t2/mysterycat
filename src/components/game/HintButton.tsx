import { memo } from "react";
import { Button } from "@/components/ui/button";

interface HintButtonProps {
  hintsUsed: number;
  maxHints: number;
  onUseHint: () => void;
  onRevealWord: () => void;
  disabled?: boolean;
}

const HINT_PENALTIES = [5, 10, 15, 20];

/** Hint button — shows "Reveal Word" after all hints are used */
const HintButton = memo(function HintButton({
  hintsUsed,
  maxHints,
  onUseHint,
  onRevealWord,
  disabled,
}: HintButtonProps) {
  const remaining = maxHints - hintsUsed;
  const allHintsUsed = remaining <= 0;
  const nextPenalty = hintsUsed < maxHints ? HINT_PENALTIES[hintsUsed] : 0;

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-3 border border-white/80 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
            {allHintsUsed ? "Give up?" : "Hints"}
          </span>
          {!allHintsUsed && !disabled ? (
            <span className="text-xs text-muted-foreground">Next: -{nextPenalty} pts</span>
          ) : allHintsUsed ? (
            <span className="text-xs text-rose-400">-25 pts penalty</span>
          ) : (
            <span className="text-xs text-muted-foreground">No hints left</span>
          )}
        </div>

        {allHintsUsed ? (
          <Button
            onClick={onRevealWord}
            disabled={disabled}
            variant="outline"
            size="sm"
            className="bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100 
              hover:border-rose-400 font-bold transition-all"
          >
            😿 Reveal Word
          </Button>
        ) : (
          <Button
            onClick={onUseHint}
            disabled={disabled || remaining <= 0}
            variant="outline"
            size="sm"
            className="bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100 
              hover:border-amber-400 font-bold transition-all disabled:opacity-50"
          >
            💡 Reveal Letter ({remaining}/{maxHints})
          </Button>
        )}
      </div>
    </div>
  );
});

export default HintButton;
