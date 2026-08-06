# Tasks: Game Foundation

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~2,100 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Delivery strategy | ask-on-risk |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| # | Goal | PR | Test cmd | Runtime harness | Rollback boundary |
|---|------|-----|----------|-----------------|-------------------|
| 1 | Foundation: constants, RNG, DT/chemistry, data catalogs | PR 1 | `npm test` | N/A (pure functions) | Delete `src/core/{dt,chemistry,rng}.js`, `src/data/` |
| 2 | Core engines: match, league, signing | PR 2 | `npm test` | N/A (pure functions) | Delete `src/core/{match,league,signing}.js` |
| 3 | Infrastructure + application use cases | PR 3 | `npm test` | N/A (injected mocks) | Delete `src/infrastructure/`, `src/application/` |
| 4 | UI: Provider, hooks, screens, components, `main.jsx` wiring | PR 4 | `npm test` | `npm run dev` → full loop | Revert `main.jsx`, delete `src/ui/` |
| 5 | Integration smoke test, requirement traceability | PR 5 | `npm test` | `npm run build && npm run preview` | Revert integration test only |

## Phase 1: Foundation — Data & DT Entity

- [ ] 1.1 Install Vitest + Testing Library + jsdom: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`, add `"test": "vitest"` to `package.json`
- [ ] 1.2 Create `src/core/rng.js` (mulberry32 seeded factory, `(seed) => () => float`) + `rng.test.js` (determinism: same seed → same sequence)
- [ ] 1.3 Create `src/data/constants.js` (5 tier thresholds, prestige deltas, chemistry bonuses, season config, tier-to-division mapping, club tier assignments)
- [ ] 1.4 Create `src/core/dt.js` (factory `(name) → {name,prestige:50,chemistry:0}`, gain/loss, tier calc, firing check at ≤10, game-over detection) + `dt.test.js`
- [ ] 1.5 Create `src/core/chemistry.js` (5-tier media bonus lookup: [0,3,6,9,12]) + `chemistry.test.js`
- [ ] 1.6 Create `src/data/events.js` (match events 15+, dashboard events 10+; each: choices, effects, probability) + `src/data/players.js` (player pool 30+, each: rating, chemistryModifier, eventUnlock)

## Phase 2: Core Engines — Match, League, Signing

- [ ] 2.1 Create `src/core/league.js` (standings sort pts→GD→GF, promotion/relegation rules, 3-match opponent generation) + `league.test.js`
- [ ] 2.2 Create `src/core/match.js` (8-moment simulateMatch, goal probability w/ chemistry bonus, penalty shootout, per-moment log) + `match.test.js`
- [ ] 2.3 Create `src/core/signing.js` (pool generation, chemistry disruption calc, sign/skip logic, signed-player persistence) + `signing.test.js`

## Phase 3: Infrastructure Adapters

- [ ] 3.1 Create `src/infrastructure/storage.js` (localStorage `get/set/remove` w/ error handling, slot-key namespacing) + `storage.test.js`
- [ ] 3.2 Create `src/infrastructure/apiFootball.js` (fetch Primera Nacional teams from RapidAPI, transform to `{id,name,logo,rating}`, memory cache, `[]` fallback on error) + `apiFootball.test.js`

## Phase 4: Application Use Cases

- [ ] 4.1 Create `src/application/saveGame.js` + `loadGame.js` (serialize to JSON w/ version field, integrity validation, corrupt rejection, migration pipeline) + tests
- [ ] 4.2 Create `src/application/playMatch.js` (inject RNG→match engine, map moments→UI actions, inject 2+1+2 match events) + `playMatch.test.js`
- [ ] 4.3 Create `src/application/playSeason.js` (orchestrate 3 matches via playMatch, compute standings, apply promotion/relegation, trigger signing) + `playSeason.test.js`
- [ ] 4.4 Create `src/application/signPlayers.js` + `changeClub.js` (sign: accept/skip w/ chemistry impact; club: firing→tier-drop→offers, tier-up→offers, chemistry reset on move) + tests

## Phase 5: UI — Provider, Hooks, Screens, Components

- [ ] 5.1 Create `src/ui/GameProvider.jsx` + `src/ui/hooks/useGameState.js` (React Context + useReducer, game state dispatch, injected RNG/storage/clubRepo) + test
- [ ] 5.2 Create `src/ui/hooks/useMatch.js` + `src/ui/hooks/useLoadSave.js` (bridge playMatch and save/load use cases to React dispatch)
- [ ] 5.3 Create `Inicio.jsx` (DT name input), `ClubSelect.jsx` (tier-filtered club list from API), `Dashboard.jsx` (season stats, play button, dashboard events) + test
- [ ] 5.4 Create `Partido.jsx` (8-moment sequence + EventModal overlay), `CambioEquipo.jsx` (job offer cards), `Resumen.jsx` (post-season standings), `ResultadoFinal.jsx` (career summary + game over)
- [ ] 5.5 Create components: `MomentCard.jsx`, `Scoreboard.jsx`, `PrestigeBar.jsx`, `ChemistryBar.jsx`, `StandingTable.jsx`, `EventModal.jsx`
- [ ] 5.6 Modify `src/main.jsx`: wrap App in GameProvider, route screens by state field (no React Router)

## Phase 6: Integration & Verification

- [ ] 6.1 Write full-loop smoke test: create DT → pick club → play season (3 matches) → signing → save/load → game over detection
- [ ] 6.2 Verify all 51 requirements across 7 capabilities traceable to at least one test case
