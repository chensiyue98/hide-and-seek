# HIDDEN

A short-session geographic deduction game. One place is hidden somewhere in the Netherlands. You have 20 Action Points, the full question catalog from the start, and a rising Threat meter. Every clue helps narrow the map; every question invites a curse. Guess when you think you know enough.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. No account, backend, token, or paid map service is required. Map tiles are served by the OpenFreeMap Liberty style. To replace the provider, set `NEXT_PUBLIC_MAP_STYLE_URL` to another compatible MapLibre style URL.

## Rules

- Start at a randomly chosen Searcher city with 20 AP and every question card visible at once, grouped by type. Questions remain available after use; Action Points and curses govern how many you can ask. Direction and Radar questions narrow the candidate map area; profile questions report traits or trends.
- Ask for a direction, radar, city comparison, population, coast-distance, relative province, region, or Thermometer clue. Direction answers are relative to your current position; Province answers only say whether the hidden place shares a province with the nearest mapped town. Hover or focus a card to read its exact effect. Thermometer compares your current position with your previous one after you move, returning HOTTER or COLDER; use it once per move. Trait clues add evidence without cutting the map area. Each turn is one action: move the Searcher or ask one question. Moving up to 50 km costs 1 AP (each additional started 50 km costs another AP). Spatial questions are centered on the Searcher, not an arbitrary map click. The cost is printed on each card.
- Each successful question costs AP and adds one Threat. Threat 3, 5, 7, and 9 trigger a curse.
- At every curse threshold, choose one of two seeded strategic curses. Signal Jam makes the next two radar readings conservative (sometimes uncertain); Question Tax adds 2 Threat to the next question in its category; Forced Move requires 30 km of movement before another question; Information Blackout holds the next answer until a later turn; Burn Card asks you to discard a hand card or take 2 Threat. Curses never fabricate geographic information.
- Geographic evidence and Thermometer travel lines accumulate on the map. Population, coast, province, region, and temperature results appear in Field Notes.
- You may guess at any time. Place a final marker and lock it in.
- Score is `min(10,000, round(10,000 × exp(-distanceKm / 60) × efficiency))`. Efficiency is 1.50 at zero questions, 1.40 at one, 1.30 at two, 1.20 at three, 1.10 at four, then 1.00.
- Share copies a spoiler-free score summary.

## Architecture

- `data/locations.ts`: local Netherlands city and town catalog with coordinates, province, population bucket, and coast bucket.
- `game/geo`: Turf-backed distance and question calculations, kept separate from React.
- `game/questions`: the full question catalog.
- `game/curses`: threshold and deterministic two-option curse selection.
- `game/scoring`: distance and efficiency score.
- `store/gameStore.ts`: Zustand game state, hidden location, AP, Searcher movement and Thermometer state, question catalog, clues, curse lifecycle, and guess/result.
- `components`: game map, hand, meters, evidence, curse reveal, and result view.
- `app`: Next.js entry point and visual system.

The secret city is stored in Zustand and is not rendered while a round is active. A seed controls the secret and curse selection; `startGame(seed)` is exposed for deterministic daily-game expansion. The MapLibre style is provider-configurable. Clues are structured values, while the map renders their persistent geometry.

## Checks

Run the game logic unit suite with `npm test`. Geography tests cover Haversine distance, direction, radar, and city comparison; rule tests cover deterministic curse selection, catalog availability, threat thresholds, and scoring.
