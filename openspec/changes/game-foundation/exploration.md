# Exploration: game-foundation

## Current State

Greenfield project. The codebase is a scaffolded Vite + React + Tailwind v4 app with a single `<div>el-mister</div>` rendered in `src/main.jsx`. No game logic, no state management, no routing, no testing infrastructure exists. This exploration is entirely domain analysis from design notes — there is no code to read.

## Game Concept Summary

A football manager (Director Técnico) game where the player manages a club through leagues and tournaments. The core loop: manage prestige/chemistry → play matches → sign players → win titles → unlock better clubs. The game draws from classic football manager tropes but simplifies to a probability-based match engine with event-driven modifiers.

---

## 1. System Interactions — The Core Loop

```
                    ┌──────────────────────────────┐
                    │        SEASON START           │
                    │  (Club assigned based on      │
                    │   prestige tier + history)    │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │        SIGNING PHASE          │
                    │  Choose new players           │
                    │  → affects chemistry          │
                    │  → affects team media         │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │      MATCH LOOP (N matches)   │
                    │  ┌─────────────────────────┐  │
                    │  │ Each match: 8 moments    │  │
                    │  │ (4 half 1, 4 half 2)    │  │
                    │  │ Events modify goal prob  │  │
                    │  │ → result modifies        │  │
                    │  │   prestige & chemistry   │  │
                    │  └─────────────────────────┘  │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │       POST-SEASON             │
                    │  Promotion/relegation calc    │
                    │  Title/bonus rewards          │
                    │  → prestige/chemistry delta   │
                    │  → if fired: club lost,       │
                    │    force job search           │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                          (next season)
```

### Interaction Matrix

| From \ To | Prestige | Chemistry | Team Media | Match Result | Signings |
|-----------|----------|-----------|------------|--------------|----------|
| **Prestige** | — | — | unlocks better clubs | — | affects player pool quality |
| **Chemistry** | — | — | modifies media via multiplier | modifies win probability | reduced by new signings |
| **Team Media** | — | boosted by high chemistry | — | base probability of winning | increased by signing good players |
| **Match Result** | win → +prestige | win → +chemistry | — | — | — |
| **Signings** | — | ↓ (disruption) | ↑ (if good players) | — | — |
| **Events** | can modify | can modify | can modify | modify goal probability | — |

### Key Feedback Loops

1. **Virtuous cycle**: Win → prestige ↑ → better club offers → better team media → easier to win → prestige ↑↑
2. **Vicious cycle**: Lose → chemistry ↓ → worse match odds → more losses → possibly fired → prestige ↓ → worse clubs
3. **Signing disruption**: New signings boost media BUT temporarily reduce chemistry (new players need time to gel). This creates a strategic tension: sign now and risk short-term chemistry, or wait and miss the player?

### Unclear / Needs Design

- **How much does chemistry modify team media?** Is it additive, multiplicative, or a threshold system?
- **What exactly triggers being "fired"?** Consecutive losses? Prestige dropping below a threshold? Failing to meet a club's bonus objective?
- **Are there mid-season events beyond match moments?** Design notes say "in-game events" for prestige/chemistry — are these during matches only, or between matches too?
- **What happens when prestige drops below a tier threshold after being unlocked?** Does the player lose access to higher-tier clubs retroactively?

---

## 2. State Machine

```
  ┌──────────┐
  │ MAIN MENU │
  │  Continue  │
  │  New Game  │
  │  Settings  │
  └─────┬─────┘
        │ (New Game)              (Continue)
        ▼                             │
  ┌──────────────┐                    ▼
  │ DT CREATION   │           ┌──────────────┐
  │ Name, avatar  │           │ SEASON STATE  │◄──────────────┐
  │ Start prestige│           │ (load from    │               │
  └──────┬───────┘            │  persistence) │               │
         │                    └──────┬────────┘               │
         ▼                           │                         │
  ┌──────────────┐                   ▼                         │
  │ CLUB SELECTION│           ┌──────────────┐                │
  │ Based on      │           │ SIGNING PHASE │               │
  │ prestige tier │           │ Choose players│               │
  └──────┬───────┘            └──────┬────────┘               │
         │                           │                         │
         └───────────────────────────┼─────────────────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │          SEASON LOOP            │
                    │  ┌───────────────────────────┐ │
                    │  │ For each match in season:  │ │
                    │  │   ┌─────────────────────┐  │ │
                    │  │   │ PRE-MATCH            │  │ │
                    │  │   │ Show opponent, media, │  │ │
                    │  │   │ bonus objectives     │  │ │
                    │  │   └────────┬────────────┘  │ │
                    │  │            ▼               │ │
                    │  │   ┌─────────────────────┐  │ │
                    │  │   │ MATCH (8 moments)    │  │ │
                    │  │   │ 4 first half moments │  │ │
                    │  │   │ HALF-TIME            │  │ │
                    │  │   │ 4 second half moments│  │ │
                    │  │   └────────┬────────────┘  │ │
                    │  │            ▼               │ │
                    │  │   ┌─────────────────────┐  │ │
                    │  │   │ POST-MATCH           │  │ │
                    │  │   │ Result, stats,        │  │ │
                    │  │   │ prestige/chem update  │  │ │
                    │  │   └────────┬────────────┘  │ │
                    │  └────────────│──────────────┘ │
                    │               ▼                │
                    │  ┌───────────────────────────┐ │
                    │  │ Next match?               │ │
                    │  │ Yes → back to PRE-MATCH   │ │
                    │  │ No  → POST-SEASON         │ │
                    │  └───────────────────────────┘ │
                    └────────────────────────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │          POST-SEASON             │
                    │  ┌───────────────────────────┐  │
                    │  │ Calculate final standings  │  │
                    │  │ Promotion/relegation       │  │
                    │  │ Title checks (Libertadores) │  │
                    │  │ Bonus objective check       │  │
                    │  │ Firing check                │  │
                    │  └────────────┬──────────────┘  │
                    │               ▼                 │
                    │  ┌───────────────────────────┐  │
                    │  │ Fired?                     │  │
                    │  │ Yes → JOB SEARCH           │  │
                    │  │ No  → SEASON END SUMMARY   │  │
                    │  └────────────┬──────────────┘  │
                    └───────────────│──────────────────┘
                                    │
                        ┌───────────▼───────────┐
                        │      SIGNING PHASE     │
                        │   (next year)          │
                        └───────────────────────┘
```

### State Transitions That Need Design

- **Quit match mid-game**: Persist as "match in progress" or auto-simulate remainder?
- **Season interruption**: Can the player save mid-season, or only between matches?
- **Job search**: Is it automatic (the game picks the best available club) or interactive (player chooses from offers)?
- **Game over state**: Is there one? If prestige drops to zero, is the DT "retired"? Or can you always rebuild from lower divisions?

---

## 3. Data Model Sketch

### Entities and Relationships

```
DirectorTecnico (DT)
├── id: string (uuid)
├── name: string
├── prestige: number (0-100 scale)
├── chemistry: number (0-100)
├── clubId: string | null
├── seasonHistory: SeasonResult[]
├── titles: Title[]
└── createdAt: timestamp

Club
├── id: string
├── name: string
├── media: number (overall rating, e.g. 1-99)
├── division: string (e.g. "primera", "ascenso")
├── tier: number (1-5, determines unlock gating)
├── bonusObjectives: BonusObjective[]
└── leagueId: string

League
├── id: string
├── name: string
├── division: string
├── tier: number
├── promotionSlots: number (how many go up)
├── relegationSlots: number (how many go down)
├── playoffSlots: number
├── totalTeams: number
└── seasonLength: number (matches per season)

Season
├── id: string
├── dtId: string
├── clubId: string
├── year: number
├── matches: Match[]
├── standings: StandingEntry[]
├── state: "signings" | "in-progress" | "completed"
└── result: SeasonResult

Match
├── id: string
├── seasonId: string
├── homeTeam: { id, name, media }
├── awayTeam: { id, name, media }
├── matchday: number
├── moments: MatchMoment[8]
├── score: { home: number, away: number }
├── events: MatchEvent[]
├── result: "win" | "loss" | "draw" | "win-penalties" | "loss-penalties"
├── chemistryModifier: number (pre-match chem applied)
└── currentMomentIndex: number (0-7, for save/resume)

MatchMoment
├── index: number (0-7)
├── half: 1 | 2
├── description: string
├── events: MatchEvent[]
├── goalProbabilityBase: number (0-1)
└── goalProbabilityModified: number (0-1)

MatchEvent
├── type: "goal" | "foul" | "card" | "injury" | "narrative" | "penalty"
├── team: "home" | "away"
├── momentIndex: number
├── description: string
└── effects: { prestige?: number, chemistry?: number, media?: number }

Player (signing)
├── id: string
├── name: string
├── position: string
├── rating: number (performance rating)
├── age: number
├── chemistryImpact: number (how much they disrupt chemistry)
└── cost: number (abstracted tradeoff value)

BonusObjective
├── id: string
├── description: string
├── type: "win_count" | "goal_diff" | "clean_sheets" | "position"
├── target: number
├── reward: { prestige?: number, chemistry?: number }
└── completed: boolean

StandingEntry
├── clubId: string
├── clubName: string
├── points: number
├── played: number
├── won: number
├── drawn: number
├── lost: number
├── goalsFor: number
├── goalsAgainst: number
└── goalDifference: number

Title
├── id: string
├── name: string
├── type: "league" | "cup" | "libertadores" | "other"
├── year: number
└── prestigeValue: number

SeasonResult
├── seasonId: string
├── year: number
├── clubName: string
├── finalPosition: number
├── outcome: "champion" | "promoted" | "relegated" | "mid-table" | "playoff-winner" | "playoff-loser"
└── stats: StandingEntry
```

### Relationship Diagram (Simplified)

```
DT 1────* Season
Season 1────* Match
Season 1────* StandingEntry
Season 1────1 Club (through clubId)
Match 1────8 MatchMoment
Match *────* MatchEvent
DT *────* Title (many to many)
Club 1────* BonusObjective
Club *────1 League
Signing *────1 Season (the signing phase belongs to a season transition)
```

### Open Design Questions

- **Should chemistry be per-club or per-DT?** The notes imply it's team-wide and resets/changes with signings. If the DT moves clubs, does chemistry carry over or reset?
- **Player persistence**: Do signed players carry between seasons? Or are they "one-year rentals" reset during each signing phase?
- **Prestige scale**: 0–100 continuous? Or discrete tiers (1–5)? The tier system suggests prestige gates unlock tiers, but prestige itself could be a continuous value that crosses tier thresholds.
- **Club data**: Is club data hardcoded (mock data) or fetched from Supabase? For MVP, hardcoded mock data is simpler and avoids Supabase dependency for core game logic.

---

## 4. Progression System

### Tier Gating

Based on the design notes, tiers determine club quality and unlock progressively:

| Tier | Clubs Available | Prestige Required | Division Examples |
|------|----------------|-------------------|-------------------|
| 1 (lowest) | Amateur / lower divisions | 0–20 | Regional leagues |
| 2 | Ascenso / B Nacional | 21–40 | Second division |
| 3 | Lower Primera | 41–60 | First division (lower half) |
| 4 | Upper Primera | 61–80 | First division (contenders) |
| 5 (highest) | Elite clubs / Libertadores contenders | 81–100 | Boca, River, etc. |

### Progression Flow

```
Start: Tier 1, low prestige (e.g., 10)
   │
   ├─ Win matches → prestige rises gradually
   ├─ Win titles → large prestige boost
   ├─ Participate in Libertadores → moderate boost
   ├─ Win Libertadores → massive boost
   │
   ▼
Prestige crosses tier 2 threshold → unlock better clubs
   │
   ├─ Player can CHOOSE to move to a tier 2 club
   ├─ Or stay and try to win more with current club
   │
   ▼
... repeat through tiers ...
   │
   ▼
Tier 5 = endgame content — maintaining prestige at elite level
```

### Unclear / Needs Design

- **Is prestige decay a thing?** If the player sits idle or loses, does prestige naturally decrease over time, or only through match losses?
- **What's the initial prestige for a new game?** 0? 10? This determines how long before the player accesses interesting clubs.
- **Are tiers strictly prestige-gated, or can a club offer the DT a job from a higher tier?** Could simulate a "surprise offer" — low probability, high impact.
- **Does the DT ever GET offers, or does the player always choose?** "Clubs that will call/hire the DT" suggests offers come in, and the player picks from available options.

---

## 5. Match Engine Approach

### Probability-Based with Event Modifiers

The core match engine is a probability model where each of the 8 moments has a chance of producing a goal for either team.

#### Base Probability Calculation

For each moment:

    baseGoalProb = f(homeMedia, awayMedia, chemistryModifier)

Where:
- `homeMedia` = home team's rating (e.g., 75)
- `awayMedia` = away team's rating (e.g., 68)
- `chemistryModifier` = DT's chemistry (0-100) mapped to a multiplier

Example approach (needs tuning):

    homeAdvantage = 1.05  (slight home bias)
    homeStrength = homeMedia * homeAdvantage * (1 + chemistryModifier / 200)
    awayStrength = awayMedia
    totalStrength = homeStrength + awayStrength

    homeGoalChance = homeStrength / totalStrength * baseRate
    awayGoalChance = awayStrength / totalStrength * baseRate

    baseRate = 0.30  (30% chance of ANY goal in a single moment)

#### Moment Structure (8 Moments)

| Moment | Half | Phase | Narrative Feel |
|--------|------|-------|---------------|
| 0 | 1 | Opening | Early pressure, feeling out |
| 1 | 1 | Mid | First chances |
| 2 | 1 | Late | Build-up to half |
| 3 | 1 | Stoppage | Last chance before whistle |
| — | — | **HALF-TIME** | Show score, brief summary |
| 4 | 2 | Opening | Tactical adjustments |
| 5 | 2 | Mid | Second-half intensity |
| 6 | 2 | Late | Desperation / holding on |
| 7 | 2 | Stoppage | Final push, dramatic finish |

#### Event System

Each moment can trigger events that modify the goal probability:

```
Event types that can fire:
├── NARRATIVE: "The crowd is on their feet!" → +5% home goal chance
├── INJURY: "Key player limping" → -3% team media for rest of match
├── FOUL: "Dangerous free kick position" → +12% goal chance for attacking team
├── RED CARD: "Player sent off!" → -10% team media for rest of match
├── PENALTY: "Penalty awarded!" → 75% goal chance (single high-prob roll)
└── MOMENTUM: "The team is firing on all cylinders" → chain bonus for next 2 moments
```

Events are drawn from a pool, possibly weighted by:
- Match context (losing team gets more "comeback" events?)
- Chemistry (higher chemistry = more positive events)
- Prestige difference (underdog gets narrative boosts?)

#### Knockout Matches (Draws → Penalties)

```
If final score is tied:
  └── Penalty shootout mini-game
      ├── 5 penalty rounds each (like real football)
      ├── Each penalty: probability based on team media + chemistry
      ├── If still tied after 5: sudden death
      └── Result: "win-penalties" or "loss-penalties"
```

### Design Decisions Needed

- **Should every moment be interactive, or auto-simulated?** Interactive moments (player makes choices during events) is more engaging but much more complex to build. Auto-simulated with event narration is simpler and works as MVP.
- **Should the player see moment-by-moment, or the whole match at once?** "Match feed" style (moment by moment) vs "full match result" style. Feed style is more dramatic and fits the 8-moment design.
- **Event catalog size**: How many different events? 10? 50? 200? This is a content problem, not a technical one. For MVP, 20-30 events across categories is enough.
- **Goal rate tuning**: 30% per moment with 8 moments means an expected ~2.4 goals per match. Is that the right feel? Needs playtesting.

---

## 6. Persistence Strategy

### What Needs to Survive Refresh

| Data | Priority | Strategy |
|------|----------|----------|
| DT state (name, prestige, chemistry) | CRITICAL | localStorage + Supabase |
| Current season state (club, match index, standings) | CRITICAL | localStorage + Supabase |
| Current match progress (moment index, score, events) | HIGH | localStorage |
| Season history (past seasons, titles) | MEDIUM | Supabase |
| Signed players (current roster) | MEDIUM | Supabase |
| Club data (static) | LOW | Hardcoded or Supabase |
| League data (static) | LOW | Hardcoded or Supabase |
| Event catalog (static) | LOW | Hardcoded JS module |
| Settings (volume, etc.) | LOW | localStorage only |

### localStorage vs Supabase

**Recommendation for MVP: localStorage-first, Supabase as optional cloud sync.**

Rationale:
- **localStorage**: Zero setup, works offline, instant, no auth needed. Perfect for MVP where the player just wants to save/load a single game. The entire game state is small enough (a few KB of JSON) to fit comfortably.
- **Supabase**: Required if we want multi-device sync, leaderboards, or cloud saves. Adds auth complexity, network dependency, and error handling burden.

#### Save/Load Architecture

```javascript
// Save structure (single JSON blob or key-value pairs)
const SAVE_KEY_PREFIX = "el-mister-save-";

// Three save slots (like classic games)
const saveSlots = {
  1: { dtState, currentSeason, ... },
  2: { dtState, currentSeason, ... },
  3: null // empty slot
};

// Auto-save after every match result
// Manual save from menu

// On load: validate save integrity, handle version migrations
```

#### Auto-Save Strategy

```
Triggers:
├── After every match result (MANDATORY)
├── After signing phase completes
├── After season ends
└── On app close (beforeunload event, best-effort)

Save integrity:
├── Checksum/hash of save data
├── Version number for migration support
└── Fallback to last known good save if corruption detected
```

### Unclear

- **Is Supabase a hard requirement for MVP, or can it be deferred?** The `package.json` already includes `@supabase/supabase-js`. If Supabase is required, we need to design the API layer early.
- **Auth flow**: If Supabase is used, does the player need to create an account? Anonymous auth? This adds significant UX complexity.

---

## 7. Technical Approach — JavaScript + Clean Architecture

### The Problem

Clean Architecture traditionally relies on interfaces and dependency inversion. JavaScript has no interfaces, no generics, no branded types. We need an adaptation that respects the architectural intent without fighting the language.

### Proposed Structure

```
src/
├── core/                    # Domain layer — pure functions, no side effects
│   ├── dt.js                # DT entity, prestige/chemistry logic
│   ├── club.js              # Club entity, media calculation
│   ├── league.js            # League entity, standings calculation
│   ├── match.js             # Match engine, probability calculation
│   ├── match-engine.js      # Pure functions: simulateMoment, calculateResult
│   ├── season.js            # Season orchestration, promotion/relegation
│   ├── signing.js           # Signing phase logic
│   ├── event-catalog.js     # Pool of match events
│   └── progression.js       # Tier/prestige gating
│
├── application/             # Use cases — orchestrate domain, call infra
│   ├── play-season.js       # Full season orchestration
│   ├── play-match.js        # Match lifecycle (pre, moments, post)
│   ├── sign-players.js      # Signing phase orchestration
│   ├── save-game.js         # Serialize/deserialize game state
│   └── load-game.js
│
├── infrastructure/          # Adapters — external dependencies
│   ├── persistence/
│   │   ├── localStorage.js  # Browser storage adapter
│   │   └── supabase.js      # (future) Cloud storage adapter
│   └── random.js            # Seeded RNG wrapper (for deterministic replays)
│
├── ui/                      # Presentational components
│   ├── screens/
│   │   ├── MainMenu.jsx
│   │   ├── NewGame.jsx
│   │   ├── SeasonView.jsx
│   │   ├── MatchView.jsx
│   │   ├── SigningView.jsx
│   │   └── PostSeason.jsx
│   └── components/
│       ├── MomentCard.jsx
│       ├── Scoreboard.jsx
│       ├── PrestigeBar.jsx
│       ├── ChemistryBar.jsx
│       └── StandingTable.jsx
│
└── main.jsx                 # Entry point
```

### How "Interfaces" Work in JS

Instead of interfaces, use JSDoc typedefs and duck typing:

```javascript
/**
 * @typedef {Object} PersistenceAdapter
 * @property {(key: string) => GameSave|null} load
 * @property {(key: string, data: GameSave) => void} save
 * @property {() => string[]} listSaves
 */

// The adapter IS the "interface" — any object with load/save/listSaves works
const localStorageAdapter = { load, save, listSaves };
const supabaseAdapter = { load, save, listSaves };

// Dependency injection via function parameters:
// export function playSeason(season, { save, random }) { ... }
```

### JSDoc as Type System

JSDoc provides documentation AND IDE autocompletion without TypeScript overhead:

```javascript
/**
 * Simulates a single moment in a match.
 *
 * @param {MatchState} match - Current match state with media, score, events
 * @param {number} momentIndex - Which of the 8 moments (0-7)
 * @param {EventCatalog} eventCatalog - Available events with probabilities
 * @param {() => number} random - Random number generator (injectable for testing)
 * @returns {{ match: MatchState, narrative: string }}
 */
export function simulateMoment(match, momentIndex, eventCatalog, random) {
  // pure function — no side effects
}
```

### Key Patterns

1. **Pure functions** in `core/` — no imports of React, DOM, localStorage, or Supabase
2. **Dependency injection** in `application/` — infrastructure is passed in, not imported
3. **Plain objects** for entities — no classes, just `{ ... }` with JSDoc typedefs
4. **Immutable updates** — spread operator for state changes: `{ ...match, score: { ...score, home: score.home + 1 } }`
5. **No `this`** — avoid class-based programming, use module-level functions with explicit parameters

### Testing Strategy (Planned)

```
test/
├── core/
│   ├── match-engine.test.js    # Pure functions, easy to test
│   ├── progression.test.js
│   ├── season.test.js
│   └── dt.test.js
├── application/
│   ├── play-match.test.js      # Orchestration tests with mock infra
│   └── save-game.test.js
└── ui/
    └── components/             # Component tests (Vitest + Testing Library)
```

Since all domain logic is pure functions, `core/` tests are deterministic — inject a seeded RNG and assert exact outputs.

---

## Summary: What's Clear vs. What Needs Design

### Clear / Solid Foundation

- **Core loop**: Season → matches → standings → promotion/relegation → repeat
- **Three key stats**: prestige (progression gate), chemistry (performance modifier), team media (base strength)
- **Match structure**: 8 moments, probability-based, events modify odds
- **Persistence**: localStorage-first with adapter pattern for future Supabase
- **Architecture**: Clean Architecture with JS adaptations (pure functions, JSDoc, plain objects)

### Needs Design Decision (Game Design)

| # | Decision | Impact |
|---|----------|--------|
| 1 | Chemistry formula (additive vs multiplicative vs threshold) | Core gameplay feel |
| 2 | Firing conditions (what triggers getting sacked) | Risk/reward tension |
| 3 | Prestige scale (0-100 continuous with tier thresholds, or pure tiers) | Progression smoothness |
| 4 | Signing carry-over (players persist or reset yearly) | Strategic depth |
| 5 | Chemistry carry-over when changing clubs | Mobility vs stability tradeoff |
| 6 | Prestige decay (passive or event-driven only) | Difficulty curve |
| 7 | Match interactivity (auto-sim or player choices during moments) | Engagement vs complexity |
| 8 | Job search mechanic (auto-assign club or player chooses) | Player agency |
| 9 | Game over condition (soft floor or hard retirement) | Replayability |

### Technical Risks

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| 1 | Match engine feels random/unfair if probabilities aren't tuned right | Medium | Expose tuning constants, allow tweaking; seed RNG for reproducibility |
| 2 | localStorage size limits (~5MB) if season history grows large | Low | Compress history, limit to N seasons, or move history to Supabase |
| 3 | Save migration breaking between versions | Medium | Version field in save format, migration functions per version bump |
| 4 | No TypeScript means more runtime errors for type mismatches | Medium | JSDoc rigorously, consider adding jsconfig.json checkJs, use defensive validation |
| 5 | Event content volume (writing 50+ match events is a lot of content work) | Low | Start with 20, add more in future releases |

### Recommendations

1. **Start with the match engine first** — it's the most isolated piece (pure functions) and the most critical for feel. Build it, test it with console output, tune probabilities before building UI.
2. **Use localStorage-only for MVP** — Supabase can be deferred. The adapter pattern in `infrastructure/` makes this a clean swap later.
3. **Decide prestige scale early** — every other system references it, and changing it later ripples through save migration, UI, and progression.
4. **Mock data for clubs/leagues** — hardcode 10-15 clubs across 2 divisions for MVP. Real data (real club names, real leagues) can come later or via Supabase.
5. **Match feed UI first** — moment-by-moment display is more dramatic and fits the 8-moment design better than showing results all at once.
