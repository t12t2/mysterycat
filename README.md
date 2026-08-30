# 🐱 Word Guess: Mystery Cat

A playful, Wordle-style word guessing game with hints, a mystery cat that's
revealed as you play, and a leaderboard.

**Live app**: <https://mysterycat.lovable.app>

## Purpose

This app was built as a **playground for product analytics and experimentation
tooling**, not primarily as a game in its own right. It's a small,
self-contained, high-interaction surface (guesses, hints, wins/losses,
leaderboard) that's well suited to exercising:

- **[Amplitude Analytics](https://amplitude.com/analytics)** — event
  tracking and behavioral analysis of gameplay (guesses submitted, hints
  used, games won/lost, leaderboard views, etc.)
- **[Amplitude Guides & Surveys](https://amplitude.com/guides-and-surveys)**
  — in-app guidance (e.g. onboarding new players to "How to Play") and
  in-context feedback collection
- **[Amplitude Session Replay](https://amplitude.com/session-replay)** —
  replaying real user sessions to see how people actually interact with the
  board, hints, and leaderboard
- **[Statsig](https://statsig.com/)** — feature flagging and
  experimentation (e.g. testing variations on hint costs, word difficulty,
  or leaderboard placement)

The gameplay itself is intentionally simple so that instrumentation,
guides/surveys, replay, and experiments are easy to set up and validate.

---

## How to Play

Guess the secret **5-letter word** in **6 tries**. Each wrong guess reveals
a little more of the mystery cat.

### Rules & mechanics

1. **The word.** Every game has a hidden 5-letter word.
2. **Guessing.** Type a 5-letter word and submit it as a guess.
3. **Feedback per letter**, shown by color:
   - 🟩 **Green** — correct letter, correct spot
   - 🟥 **Red** — correct letter, wrong spot
   - ⬜ **Gray (✕)** — letter is not in the word
4. **Tries.** You get up to **6 guesses** to find the word.
5. **The mystery cat.** Each incorrect guess reveals another piece of a
   hidden cat image — by the time you're out of guesses, the full cat is
   visible.
6. **Hints.** Up to **3 hints** are available per game — but using a hint
   **costs points**, so there's a tradeoff between solving the word outright
   and using help along the way.
7. **Winning/losing.** Guess the word within 6 tries to win; run out of
   tries and the word (and full cat) is revealed.
8. **Leaderboard.** Scores are tracked on a leaderboard, rewarding players
   who solve the word in fewer guesses and with fewer hints.

---

## Build with Lovable

This project was built with [Lovable](https://lovable.dev).

Continue developing this project in the
[Lovable editor](https://lovable.dev/projects/7d31147a-0229-453c-9a92-5f2eda983abe).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

---

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```bash
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
