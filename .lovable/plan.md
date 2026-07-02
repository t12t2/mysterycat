Port the Superblocks WordGuess game from GitHub into this Lovable project and publish it live.

What I found in the repo
- Public repo: `t12t2/wordguess_ss` (branch `superblocks/live`)
- A fully client-side Wordle-style word-guessing game with cat illustrations, hints, leaderboard, and win/lose overlays
- Built with React 18 + React Router + Tailwind + Superblocks runtime
- The `server/` folder is empty of real APIs, so no backend is needed
- The game stores the leaderboard in `localStorage`

Plan
1. **Move game logic into this project**
   - Copy `game-types.ts`, `game-engine.ts`, `leaderboard.ts`, and the four word-list files into `src/lib/`
2. **Move game UI components into this project**
   - Copy all components from `client/components/game/` into `src/components/game/`
3. **Replace the placeholder homepage**
   - Update `src/routes/index.tsx` to render the WordGuess game instead of the placeholder image
4. **Adapt the styling**
   - Keep the existing playful gradient/pastel look from the Superblocks app
   - Merge its color tokens into the project’s `src/styles.css` so it works with Tailwind v4
   - Remove any Superblocks-specific classes/dependencies (e.g., `AppProvider`, `react-router` imports)
5. **Verify dependencies**
   - The game only uses `Button`, `Input`, and `Dialog` from shadcn/ui, which are already installed
   - No extra npm packages are needed
6. **Build and test**
   - Run the local dev build and check the preview for gameplay, keyboard input, hints, overlays, and leaderboard
7. **Publish**
   - Click Publish in Lovable to deploy to the live URL

Estimated scope: a single focused port of one game route and its supporting files. No backend or database changes required.