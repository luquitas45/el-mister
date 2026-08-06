# Design: Game Foundation

## Technical Approach

Clean Architecture in plain JS: pure domain functions in `core/`, use-case orchestrators in `application/`, adapters in `infrastructure/`, React components in `ui/`. No classes — plain objects with JSDoc `@typedef` duck typing. Dependencies flow `ui → application → core ← infrastructure`. React Context + `useReducer` for game state; screen routing via state field (no React Router). Seeded RNG (`mulberry32`) ensures reproducible matches.

## Architecture Decisions

| Decision | Option A | Option B | Choice | Rationale |
|---|---|---|---|---|
| State management | React Context + useReducer | Zustand / Redux | Context + useReducer | Zero deps, sufficient for single-context game state, matches Clean Architecture dispatch pattern |
| Screen routing | State field in useReducer | React Router | State field | No URL-based navigation needed; screens are sequential game phases, not independent pages |
| Dependency injection | Function params (RNG, storage, clubRepo) | Module-level singletons | Function params | Core functions remain pure and testable; no import mocking needed |
| Seeded RNG algorithm | mulberry32 | xoshiro128 | mulberry32 | Single 32-bit seed sufficient; tiny implementation (~5 lines); well-known statistical properties |
| API-Football caching | Fetch once at game start, hold in context | Re-fetch per division change | Fetch once | Primera Nacional data never changes mid-session; avoids rate limits |
| Save format | Single JSON blob per slot | IndexedDB key-value | JSON blob | ~10KB per save fits well within 5MB localStorage; simpler migration |
| Module format | ES modules (project default) | CommonJS | ES modules | Already configured in package.json `"type": "module"` |

## Data Flow

```
Inicio → ClubSelect → Dashboard → Partido → [Resumen? → CambioEquipo? → Signing?] → loop
  │          │            │            │
  └── DT creation    └── API-Football fetch (once)
                           │
                  ┌────────┘
                  ▼
            GameProvider (Context + useReducer)
              ├── gameState { dt, season, club, signedPlayers, history }
              ├── rng: seeded mulberry32 instance
              ├── clubRepo: cached API-Football data
              └── storage: localStorage adapter
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
       useMatch    useLoadSave   useSeason
       (dispatch   (saveGame/    (playSeason
        actions)   loadGame)     orchestrate)
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/core/dt.js` | Create | DT factory, prestige/chemistry modifiers, tier calculation, firing check |
| `src/core/chemistry.js` | Create | Chemistry tier thresholds (5 tiers), media bonus lookup function |
| `src/core/match.js` | Create | 8-moment simulation, goal probability formula, penalty shootout |
| `src/core/league.js` | Create | Standings sort, promotion/relegation rules, opponent generation |
| `src/core/signing.js` | Create | Player pool selection, chemistry disruption calculation |
| `src/core/rng.js` | Create | mulberry32 seeded RNG factory: `(seed) => () => float` |
| `src/application/playSeason.js` | Create | Orchestrates 3 matches, computes standings, triggers promotion/relegation |
| `src/application/playMatch.js` | Create | Injects RNG into match engine, maps moments to UI actions, handles events |
| `src/application/signPlayers.js` | Create | Signing phase: generate pool, apply choice, update DT |
| `src/application/changeClub.js` | Create | Firing check, offer generation, club change + chemistry reset |
| `src/application/saveGame.js` | Create | Serialize game state to JSON, write via storage adapter |
| `src/application/loadGame.js` | Create | Read, validate, migrate, hydrate game state from localStorage |
| `src/infrastructure/storage.js` | Create | localStorage wrapper: `get/set/remove` with error handling |
| `src/infrastructure/apiFootball.js` | Create | Fetch teams from RapidAPI, transform to `{name,logo,rating}`, cache in memory |
| `src/ui/GameProvider.jsx` | Create | React Context provider wrapping useReducer + injected adapters |
| `src/ui/hooks/useGameState.js` | Create | `useContext(GameContext)` convenience hook |
| `src/ui/hooks/useMatch.js` | Create | Bridges `playMatch` use case to React: dispatches moment-by-moment |
| `src/ui/hooks/useLoadSave.js` | Create | Save/load dialog logic, slot selection |
| `src/ui/screens/Inicio.jsx` | Create | DT name input, prestige/chemistry display |
| `src/ui/screens/ClubSelect.jsx` | Create | Club list filtered by tier from cached API data |
| `src/ui/screens/Dashboard.jsx` | Create | Season stats, play button, dashboard events |
| `src/ui/screens/Partido.jsx` | Create | 8-moment sequence with event modals |
| `src/ui/screens/CambioEquipo.jsx` | Create | Club offer cards after firing/tier-up |
| `src/ui/screens/Resumen.jsx` | Create | Post-season standings, promotion/relegation result |
| `src/ui/screens/ResultadoFinal.jsx` | Create | Career summary, game-over screen |
| `src/ui/components/MomentCard.jsx` | Create | Single match moment: goal/no-goal animation |
| `src/ui/components/Scoreboard.jsx` | Create | Home vs Away score display |
| `src/ui/components/PrestigeBar.jsx` | Create | Horizontal bar: prestige 0–100 |
| `src/ui/components/ChemistryBar.jsx` | Create | Horizontal bar: chemistry 0–100 with tier indicator |
| `src/ui/components/StandingTable.jsx` | Create | Sorted team standings table |
| `src/ui/components/EventModal.jsx` | Create | Floating modal: event narrative + 2+ choice buttons |
| `src/data/events.js` | Create | Event catalog: match events (15+) + dashboard events (10+) |
| `src/data/players.js` | Create | Signing player pool: 30+ players with rating, chemistry modifier, event hooks |
| `src/data/constants.js` | Create | Tier thresholds, prestige gains/losses, chemistry bonuses, season config |
| `src/main.jsx` | Modify | Wrap app in GameProvider, render screen based on state |

## Key Contracts

**GameState (JSDoc typedef):**

```
@typedef {{ dt: DT, season: Season, club: Club, screen: string,
            history: MatchResult[], signedPlayers: Player[] }} GameState
```

**DT:** `{ name: string, prestige: number (0–100), chemistry: number (0–100) }`

**Match engine function signature:** `simulateMatch(home, away, rng, events) → { moments: Moment[], score: Score, events: EventResult[] }`

**Storage adapter port (duck-typed):** `{ load(slot): string|null, save(slot, json): void, remove(slot): void }`

**API-Football adapter port:** `{ getClubs(): Promise<Club[]> }` — caches internally; returns `[]` on error.

## Match Engine Design

**Goal probability per moment:**

```
p = (homeMedia + chemistryBonus + homeRating) / (homeMedia + chemistryBonus + homeRating + awayMedia + awayRating)
```

- `homeMedia`: club base media value (1–10)
- `chemistryBonus`: 0, 3, 6, 9, or 12 based on DT chemistry tier
- `homeRating`, `awayRating`: club rating from API-Football (1–100 normalized)

Roll seeded RNG; if `roll < p` → home goal; else → away goal.

**Event injection:** At moments 2, 3 (1st half), moment 4 (half-time), moments 5, 6 (2nd half), draw from event catalog with per-slot probability. Not guaranteed.

**Penalty shootout (knockout draws):** 5 alternating rounds with 75% base conversion rate; sudden death if tied.

**New game flow:**

```
Inicio: DT name → prestige seed (50) → API-Football fetch clubs
  → ClubSelect: tier-filtered club list → DT picks → season starts
  → Dashboard → Play → Partido (×3) → Resumen → Signing → loop
```

## Persistence Design

**Save JSON schema:** `{ version: 1, dt: DT, season: Season, club: Club, signedPlayers: Player[], history: MatchResult[], screen: string }`

**Auto-save trigger:** dispatch after `MATCH_COMPLETE` action in useReducer.

**Migration strategy:** `loadGame` reads `version`; applies `migrateV[n]ToV[n+1]` functions sequentially. No migration needed at v1 (first schema).

## API-Football Integration

- **Endpoint:** `GET /v3/teams?league=130&country=argentina` (Primera Nacional ID)
- **Rate limit budget:** ~10 req/min on free tier; 1 fetch per game session
- **Transform:** `response[].team` → `{ id, name, logo, rating: id % 100 + 1 }` (rating derived placeholder)
- **Error handling:** fetch fails → show empty club list with retry button; no crash

## Testing Strategy

| Layer | What | How |
|---|---|---|
| Unit (core/) | DT modifiers, chemistry tiers, match probability, standings sort, RNG determinism | Pure functions, no deps; Vitest |
| Integration (application/) | playSeason with mock RNG, saveGame/loadGame with mock storage, changeClub flow | Inject mock adapters; Vitest |
| Component (ui/) | Screen rendering, EventModal choices, PrestigeBar thresholds | Vitest + Testing Library |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. This is a client-only browser game.

## Migration / Rollout

No migration required. This is the first feature, no existing code depends on game logic. Rollback is a clean file deletion.

## Open Questions

- None. All 7 specs define requirements with concrete scenarios.
