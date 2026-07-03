import { useMemo } from "react";

interface CatDrawingProps {
  incorrectGuesses: number;
  /** When true, show the cat fully revealed with a celebration style */
  revealed?: boolean;
  /** When true, show the cat fully revealed but crying (word-reveal loss) */
  crying?: boolean;
}

/**
 * Cute SVG cat that progressively reveals as the player makes incorrect guesses.
 * Designed to fill the left panel on desktop.
 */
export default function CatDrawing({
  incorrectGuesses,
  revealed = false,
  crying = false,
}: CatDrawingProps) {
  const fullyShown = revealed || crying;
  const effectiveIncorrect = fullyShown ? 6 : incorrectGuesses;

  const revealPercent = useMemo(() => {
    if (fullyShown) return 100;
    switch (incorrectGuesses) {
      case 0:
        return 0;
      case 1:
        return 16.7;
      case 2:
        return 33.3;
      case 3:
        return 50;
      case 4:
        return 66.7;
      case 5:
        return 83.3;
      default:
        return 100;
    }
  }, [incorrectGuesses, fullyShown]);

  const clipWidth = (revealPercent / 100) * 280;

  const dangerLevel = crying
    ? "crying"
    : revealed
      ? "won"
      : incorrectGuesses <= 2
        ? "safe"
        : incorrectGuesses <= 4
          ? "warning"
          : "danger";

  const borderColor =
    dangerLevel === "crying"
      ? "border-blue-300"
      : dangerLevel === "won"
        ? "border-emerald-300"
        : dangerLevel === "safe"
          ? "border-emerald-200"
          : dangerLevel === "warning"
            ? "border-amber-300"
            : "border-rose-300";

  const bgGlow =
    dangerLevel === "crying"
      ? "shadow-blue-200/60"
      : dangerLevel === "won"
        ? "shadow-emerald-200/60"
        : dangerLevel === "safe"
          ? "shadow-emerald-100/50"
          : dangerLevel === "warning"
            ? "shadow-amber-100/50"
            : "shadow-rose-100/50";

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Stage label */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i < incorrectGuesses
                ? i < 2
                  ? "bg-emerald-400 scale-110"
                  : i < 4
                    ? "bg-amber-400 scale-110"
                    : "bg-rose-400 scale-110"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Cat container — scales to fill available space */}
      <div
        className={`relative w-full aspect-[280/220] max-w-[360px] lg:max-w-[420px] xl:max-w-[480px] rounded-3xl border-2 overflow-hidden transition-all duration-500 shadow-lg ${borderColor} ${bgGlow}`}
        style={{ background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)" }}
      >
        {effectiveIncorrect === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="text-5xl animate-bounce-slow">🐱</div>
            <span className="text-amber-400 text-sm font-semibold tracking-wide animate-pulse">
              ??? Mystery Cat ???
            </span>
          </div>
        ) : (
          <svg
            viewBox="0 0 280 220"
            className="w-full h-full"
            style={{ transition: "all 0.6s ease-out" }}
          >
            <defs>
              <clipPath id="cat-reveal">
                <rect
                  x="0"
                  y="0"
                  width={clipWidth}
                  height="220"
                  style={{ transition: "width 0.6s ease-out" }}
                />
              </clipPath>
            </defs>

            <g clipPath="url(#cat-reveal)">
              {/* Body */}
              <ellipse cx="140" cy="155" rx="70" ry="40" fill="#F59E0B" />
              <ellipse cx="140" cy="155" rx="62" ry="32" fill="#FBBF24" />

              {/* Head */}
              <circle cx="100" cy="95" r="42" fill="#F59E0B" />
              <circle cx="100" cy="95" r="37" fill="#FBBF24" />

              {/* Left ear */}
              <polygon points="65,60 73,28 87,64" fill="#F59E0B" />
              <polygon points="69,59 74,37 84,63" fill="#FDE68A" />

              {/* Right ear */}
              <polygon points="113,64 125,28 135,60" fill="#F59E0B" />
              <polygon points="115,63 124,37 132,59" fill="#FDE68A" />

              {/* Left eye */}
              <ellipse cx="84" cy="90" rx="9" ry="10" fill="white" />
              <circle cx="85" cy="90" r="5" fill="#1E293B" />
              <circle cx="87" cy="88" r="2" fill="white" />

              {/* Right eye */}
              <ellipse cx="116" cy="90" rx="9" ry="10" fill="white" />
              <circle cx="117" cy="90" r="5" fill="#1E293B" />
              <circle cx="119" cy="88" r="2" fill="white" />

              {/* Nose */}
              <polygon points="100,101 96,106 104,106" fill="#F472B6" />

              {/* Mouth — frown when crying, smile otherwise */}
              {crying ? (
                <path
                  d="M90,114 Q100,106 110,114"
                  fill="none"
                  stroke="#92400E"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M90,109 Q100,118 110,109"
                  fill="none"
                  stroke="#92400E"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}

              {/* Tears when crying */}
              {crying && (
                <>
                  <ellipse cx="80" cy="100" rx="2.5" ry="4" fill="#60A5FA" opacity="0.7" />
                  <ellipse cx="78" cy="108" rx="2" ry="3" fill="#93C5FD" opacity="0.5" />
                  <ellipse cx="120" cy="100" rx="2.5" ry="4" fill="#60A5FA" opacity="0.7" />
                  <ellipse cx="122" cy="108" rx="2" ry="3" fill="#93C5FD" opacity="0.5" />
                </>
              )}

              {/* Whiskers left */}
              <line x1="42" y1="98" x2="78" y2="102" stroke="#92400E" strokeWidth="1.2" />
              <line x1="44" y1="106" x2="78" y2="106" stroke="#92400E" strokeWidth="1.2" />
              <line x1="42" y1="114" x2="78" y2="110" stroke="#92400E" strokeWidth="1.2" />

              {/* Whiskers right */}
              <line x1="122" y1="102" x2="158" y2="98" stroke="#92400E" strokeWidth="1.2" />
              <line x1="122" y1="106" x2="156" y2="106" stroke="#92400E" strokeWidth="1.2" />
              <line x1="122" y1="110" x2="158" y2="114" stroke="#92400E" strokeWidth="1.2" />

              {/* Front paws */}
              <ellipse cx="105" cy="188" rx="13" ry="9" fill="#F59E0B" />
              <ellipse cx="105" cy="188" rx="10" ry="7" fill="#FBBF24" />
              <ellipse cx="135" cy="190" rx="13" ry="9" fill="#F59E0B" />
              <ellipse cx="135" cy="190" rx="10" ry="7" fill="#FBBF24" />

              {/* Tail */}
              <path
                d="M210,150 Q235,115 230,85 Q228,72 218,78"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M210,150 Q235,115 230,85 Q228,72 218,78"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Stripes on body */}
              <path d="M118,135 Q124,142 118,149" fill="none" stroke="#D97706" strokeWidth="2.5" />
              <path d="M138,132 Q144,139 138,146" fill="none" stroke="#D97706" strokeWidth="2.5" />
              <path d="M158,135 Q164,142 158,149" fill="none" stroke="#D97706" strokeWidth="2.5" />
            </g>
          </svg>
        )}

        {/* Progress bar at bottom */}
        {!fullyShown && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-100/60">
            <div
              className="h-full transition-all duration-600 ease-out rounded-r-full"
              style={{
                width: `${revealPercent}%`,
                backgroundColor:
                  dangerLevel === "safe"
                    ? "#22C55E"
                    : dangerLevel === "warning"
                      ? "#F59E0B"
                      : "#EF4444",
              }}
            />
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground font-medium">
        {crying
          ? "😿 The mystery cat is sad..."
          : revealed
            ? "🎉 You found the mystery cat!"
            : incorrectGuesses === 0
              ? "The mystery cat is hiding..."
              : incorrectGuesses < 6
                ? `Cat revealed: ${Math.round(revealPercent)}%`
                : "Oh no! The cat is fully revealed!"}
      </p>
    </div>
  );
}
