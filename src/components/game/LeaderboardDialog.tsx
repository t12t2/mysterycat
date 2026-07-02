import { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ScoreEntry } from "@/lib/game-types";

interface LeaderboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scores: ScoreEntry[];
  onStartNewGame: () => void;
  onClearScores: () => void;
}

function trophyEmoji(index: number): string {
  switch (index) {
    case 0:
      return "🥇";
    case 1:
      return "🥈";
    case 2:
      return "🥉";
    default:
      return "";
  }
}

function rankColor(index: number): string {
  switch (index) {
    case 0:
      return "text-yellow-500";
    case 1:
      return "text-gray-400";
    case 2:
      return "text-amber-700";
    default:
      return "text-foreground";
  }
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function LeaderboardDialog({
  open,
  onOpenChange,
  scores,
  onStartNewGame,
  onClearScores,
}: LeaderboardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">🏆 Leaderboard</DialogTitle>
        </DialogHeader>

        {scores.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground mb-2">No scores yet!</p>
            <p className="text-sm text-muted-foreground">
              Play a game and win to see your score here!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {scores.map((score, index) => (
              <div
                key={score.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border"
              >
                <div className={`text-lg font-bold w-8 text-center ${rankColor(index)}`}>
                  {index < 3 ? trophyEmoji(index) : `#${index + 1}`}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold truncate">{score.name}</span>
                    <span className="text-blue-600 font-bold text-sm">{score.score} pts</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-0.5">
                    <span>Word: {score.word}</span>
                    <span>{score.guesses} guesses</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{formatDate(score.date)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
          <Button
            onClick={() => {
              onOpenChange(false);
              onStartNewGame();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold"
          >
            Start New Game
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {scores.length > 0 && (
            <button
              onClick={onClearScores}
              className="text-xs text-rose-500 hover:text-rose-600 transition-colors mt-1"
            >
              Clear All Scores
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
