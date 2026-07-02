import { memo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { initStatsig } from "@/lib/statsig";

interface WelcomeScreenProps {
  onStartGame: () => void;
  onViewLeaderboard: () => void;
}

/** Welcome splash — single compact card, cat centred above instructions */
const WelcomeScreen = memo(function WelcomeScreen({
  onStartGame,
  onViewLeaderboard,
}: WelcomeScreenProps) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const p = initStatsig();
    if (!p) return;
    p.then((client) => {
      if (cancelled) return;
      try {
        if (client.checkGate("welcome_banner")) setShowBanner(true);
      } catch {
        // gate not configured — leave banner hidden
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center animate-in fade-in duration-500 py-6 px-4">
      {showBanner && (
        <div className="w-full max-w-md mb-4 rounded-xl bg-red-600 text-white font-bold text-center py-3 px-4 shadow-md">
          Welcome to my test playground
        </div>
      )}
      <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 max-w-md w-full flex flex-col items-center gap-5 border border-gray-100">
        {/* Cat illustration */}
        <div
          className="w-40 h-40 rounded-2xl border-2 border-amber-200 overflow-hidden shadow-md"
          style={{
            background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)",
          }}
        >
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className="text-5xl animate-bounce-slow">🐱</div>
            <span className="text-amber-400 text-xs font-semibold tracking-wide animate-pulse">
              ??? Mystery Cat ???
            </span>
          </div>
        </div>

        {/* Title + subtitle */}
        <div className="text-center">
          <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Ready to Play?
          </h2>
          <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
            Guess the 5-letter word in 6 tries. Each wrong guess reveals more of the mystery cat!
          </p>
        </div>

        {/* How to play */}
        <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h3 className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground mb-2.5">
            How to Play
          </h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-white w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0">
                G
              </span>
              <span>Green = correct letter, correct spot</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-500 text-white w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0">
                R
              </span>
              <span>Red = correct letter, wrong spot</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-gray-400 text-white w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0">
                ✕
              </span>
              <span>Gray = letter not in the word</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="w-6 text-center text-sm shrink-0">💡</span>
              <span>Up to 3 hints — but they cost points!</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="w-full flex flex-col gap-2.5">
          <Button
            onClick={onStartGame}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg py-6 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 w-full"
          >
            🎮 Start Game
          </Button>
          <Button
            onClick={onViewLeaderboard}
            variant="outline"
            size="lg"
            className="font-bold text-base py-5 rounded-xl border-2 w-full"
          >
            🏆 Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
});

export default WelcomeScreen;
