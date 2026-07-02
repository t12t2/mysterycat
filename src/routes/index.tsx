import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import type { GameData, ScoreEntry } from "@/lib/game-types";
import {
  createInitialGameData,
  startNewGame,
  getDisplayWord,
  makeGuess,
  applyHint,
  revealWord,
  getKeyboardLetterStates,
} from "@/lib/game-engine";
import { loadScores, addScore, clearScores } from "@/lib/leaderboard";
import { Button } from "@/components/ui/button";

import WelcomeScreen from "@/components/game/WelcomeScreen";
import GameHeader from "@/components/game/GameHeader";
import CatDrawing from "@/components/game/CatDrawing";
import WordDisplay from "@/components/game/WordDisplay";
import GuessFeedback from "@/components/game/GuessFeedback";
import GuessInput from "@/components/game/GuessInput";
import GameKeyboard from "@/components/game/GameKeyboard";
import HintButton from "@/components/game/HintButton";
import { WinOverlay, LoseOverlay } from "@/components/game/GameOverlay";
import LeaderboardDialog from "@/components/game/LeaderboardDialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Word Guess — Guess the 5-letter word" },
      {
        name: "description",
        content:
          "A playful Wordle-style word guessing game with hints, a cute cat, and a leaderboard.",
      },
      { property: "og:title", content: "Word Guess — Guess the 5-letter word" },
      {
        property: "og:description",
        content:
          "A playful Wordle-style word guessing game with hints, a cute cat, and a leaderboard.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [game, setGame] = useState<GameData>(createInitialGameData);
  const [inputText, setInputText] = useState("");
  const [scores, setScores] = useState<ScoreEntry[]>(() => loadScores());
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showWinOverlay, setShowWinOverlay] = useState(false);
  const [showLoseOverlay, setShowLoseOverlay] = useState(false);
  const [wordRevealed, setWordRevealed] = useState(false);

  useEffect(() => {
    if (game.gameState === "won") {
      setShowWinOverlay(true);
    } else if (game.gameState === "lost") {
      setShowLoseOverlay(true);
    }
  }, [game.gameState]);

  // Physical keyboard input
  useEffect(() => {
    if (game.gameState !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "Enter") {
        e.preventDefault();
        if (inputText.length > 0) {
          handleSubmitGuess();
        }
      } else if (e.key === "Backspace") {
        e.preventDefault();
        setInputText((prev) => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        setInputText((prev) => {
          if (prev.length < 5) return prev + e.key.toUpperCase();
          return prev;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [game.gameState, inputText]);

  const handleStartGame = useCallback(() => {
    setGame(startNewGame());
    setInputText("");
    setShowWinOverlay(false);
    setShowLoseOverlay(false);
    setWordRevealed(false);
  }, []);

  const handleSubmitGuess = useCallback(() => {
    if (!inputText || game.gameState !== "playing") return;
    const result = makeGuess(game, inputText);
    setGame(result.game);
    if (result.result.isValid) {
      setInputText("");
    }
  }, [inputText, game]);

  const handleUseHint = useCallback(() => {
    setGame((prev) => {
      const next = useHint(prev);
      if (next.gameState === "lost" && prev.gameState === "playing") {
        setWordRevealed(true);
      }
      return next;
    });
  }, []);

  const handleRevealWord = useCallback(() => {
    setWordRevealed(true);
    setGame((prev) => revealWord(prev));
  }, []);

  const handleKeyboardPress = useCallback((letter: string) => {
    setInputText((prev) => {
      if (prev.length < 5) return prev + letter;
      return prev;
    });
  }, []);

  const handleKeyboardDelete = useCallback(() => {
    setInputText((prev) => prev.slice(0, -1));
  }, []);

  const handleSaveScore = useCallback(
    (name: string) => {
      const updated = addScore(name, game.score, game.currentWord, game.guessCount);
      setScores(updated);
      setShowWinOverlay(false);
      setShowLeaderboard(true);
    },
    [game.score, game.currentWord, game.guessCount],
  );

  const handleSkipSave = useCallback(() => {
    setShowWinOverlay(false);
    setShowLeaderboard(true);
  }, []);

  const handleLosePlayAgain = useCallback(() => {
    setShowLoseOverlay(false);
    handleStartGame();
  }, [handleStartGame]);

  const handleLoseViewLeaderboard = useCallback(() => {
    setShowLoseOverlay(false);
    setShowLeaderboard(true);
  }, []);

  const handleClearScores = useCallback(() => {
    clearScores();
    setScores([]);
  }, []);

  const handleRestartGame = useCallback(() => {
    setShowWinOverlay(false);
    setShowLoseOverlay(false);
    setWordRevealed(false);
    handleStartGame();
  }, [handleStartGame]);

  const displayLetters = game.gameState !== "waiting" ? getDisplayWord(game) : [];
  const keyboardStates = getKeyboardLetterStates(game);
  const isPlaying = game.gameState === "playing";

  return (
    <div className="min-h-screen overflow-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="border-b border-white/60 bg-white/40 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            🐱 Word Guess
          </h1>
          <div className="flex items-center gap-2">
            {game.gameState !== "waiting" && (
              <Button
                onClick={handleRestartGame}
                variant="ghost"
                size="sm"
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 font-semibold"
              >
                🔄 New Game
              </Button>
            )}
            <Button
              onClick={() => setShowLeaderboard(true)}
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-semibold"
            >
              🏆 Leaderboard
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {game.gameState === "waiting" ? (
          <WelcomeScreen
            onStartGame={handleStartGame}
            onViewLeaderboard={() => setShowLeaderboard(true)}
          />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            <div className="lg:w-[380px] shrink-0 flex flex-col gap-5">
              <GameHeader
                score={game.score}
                guessCount={game.guessCount}
                incorrectGuesses={game.incorrectGuesses}
              />
              <CatDrawing
                incorrectGuesses={game.incorrectGuesses}
                revealed={game.gameState === "won"}
                crying={wordRevealed && game.gameState === "lost"}
              />
              {isPlaying && (
                <div className="hidden lg:block">
                  <HintButton
                    hintsUsed={game.hintsUsed}
                    maxHints={4}
                    onUseHint={handleUseHint}
                    onRevealWord={handleRevealWord}
                  />
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-5 min-w-0">
              <WordDisplay letters={displayLetters} />
              {game.wordFeedback.length > 0 && (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/80 shadow-sm">
                  <GuessFeedback feedback={game.wordFeedback} />
                </div>
              )}
              {isPlaying && (
                <>
                  <GuessInput
                    value={inputText}
                    onChange={setInputText}
                    onSubmit={handleSubmitGuess}
                    errorMessage={game.errorMessage}
                  />
                  <GameKeyboard
                    letterStates={keyboardStates}
                    onKeyPress={handleKeyboardPress}
                    onDelete={handleKeyboardDelete}
                    onSubmit={handleSubmitGuess}
                  />
                  <div className="lg:hidden">
                    <HintButton
                      hintsUsed={game.hintsUsed}
                      maxHints={4}
                      onUseHint={handleUseHint}
                      onRevealWord={handleRevealWord}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {showWinOverlay && game.gameState === "won" && (
        <WinOverlay
          score={game.score}
          word={game.currentWord}
          guesses={game.guessCount}
          onSaveScore={handleSaveScore}
          onSkip={handleSkipSave}
        />
      )}

      {showLoseOverlay && game.gameState === "lost" && (
        <LoseOverlay
          word={game.currentWord}
          score={game.score}
          onPlayAgain={handleLosePlayAgain}
          onViewLeaderboard={handleLoseViewLeaderboard}
        />
      )}

      <LeaderboardDialog
        open={showLeaderboard}
        onOpenChange={setShowLeaderboard}
        scores={scores}
        onStartNewGame={handleStartGame}
        onClearScores={handleClearScores}
      />
    </div>
  );
}
