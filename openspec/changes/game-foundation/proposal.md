# Proposal: Game Foundation (MVP v1)

## Intent

Build the entire core loop of a football manager game from zero: create a DT, pick a club from real Primera Nacional data via API-Football, manage seasons through probability-based matches, sign players, climb divisions, and face firing/game-over risks. This is the minimum playable game — just the loop.

## Scope

### In Scope
- DT creation with name, prestige (0-100), chemistry (0-100)
- 2-division league with real clubs from API-Football (Primera Nacional Argentina)
- Tier-based club gating via prestige thresholds (5 tiers)
- 3-match season with auto-simulated opponents and standings
- Match engine: 8 moments (4+4), probability-based goals
- Match events: up to 5 per match (2 in 1st half + 1 at half-time + 2 in 2nd half), not guaranteed to fire
- Dashboard events: random events between matches with player choices affecting prestige/chemistry
- Chemistry: threshold-based media bonus (5 tiers, +0 to +12 media)
- Prestige: gains from wins/titles, losses from defeats only
- Annual signing phase: sign one player or skip (chemistry +/- impact)
- Promotion/relegation between divisions
- Club change: fired (prestige ≤10%), offers on tier-up, chemistry resets on move
- Game over: prestige at minimum AND in Ascenso
- localStorage persistence with 3 save slots, auto-save after every match
- UI screens: Inicio (DT name + alignment + club pick), Dashboard (stats + play button + events), Partido (moment sequence), Cambio equipo (available clubs), Resumen (post-season), Resultado final (career summary + game over)
- Floating modal windows for events during matches

### Out of Scope
- Libertadores or cups beyond league, Supabase integration
- Player career stats/attributes beyond rating, multi-device sync
- Animations, sound, advanced UI polish

## Capabilities

> No existing specs — all capabilities are new.

### New Capabilities
- `dt-management`: DT entity, prestige/chemistry lifecycle, tier progression
- `club-system`: club selection, tier gating, API-Football data, job offers, firing
- `league-system`: 2-division structure, standings, promotion/relegation rules, 3-match season
- `match-engine`: 8-moment simulation, goal probabilities, match event injection, seeded RNG
- `event-system`: match events (2+1+2 structure), dashboard events with player choices
- `signing-system`: annual player pool, chemistry disruption, one-sign-or-skip choice
- `game-state`: 3-slot localStorage persistence, auto-save triggers, load/migration, game-over detection

### Modified Capabilities
None.

## Approach

Clean Architecture in JS: pure domain functions in `core/`, use-case orchestrators in `application/`, adapter in `infrastructure/`, presentational React components in `ui/`. Plain objects with JSDoc typedefs instead of classes. Injected dependencies (RNG, persistence) for testability. Build match engine first as isolated pure logic, then wire UI.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/core/` | New | Match engine, progression, signing, league, DT, club domain logic |
| `src/application/` | New | playSeason, playMatch, signPlayers, saveGame, loadGame use cases |
| `src/infrastructure/` | New | localStorage adapter, API-Football adapter, seeded RNG wrapper |
| `src/ui/screens/` | New | 6 screens: Inicio, Dashboard, Partido, CambioEquipo, Resumen, ResultadoFinal |
| `src/ui/components/` | New | MomentCard, Scoreboard, PrestigeBar, ChemistryBar, StandingTable, EventModal |
| `src/data/` | New | Event catalog, signing player pool |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Match engine feels unfair/random | Med | Seeded RNG for reproducibility, tuning constants exposed as config |
| localStorage size ceiling | Low | Single save is ~5-10KB JSON; 3 slots well under 5MB limit |
| Save schema migration breaks on future changes | Med | Version field in save, migration functions per version bump |

## Rollback Plan

Revert the `game-foundation` change folder. No existing code depends on game logic — this is the first feature. Rollback is a clean file deletion.

## Dependencies

- API-Football (RapidAPI) for Primera Nacional club data
- `.env` with `VITE_RAPIDAPI_KEY` for API-Football access

## Success Criteria

- [ ] New game → DT creation → club selection → full season (3 matches) → post-season → signing → game over or continue
- [ ] Match engine produces plausible scorelines with 8 moments, events fire in 2+1+2 structure
- [ ] Prestige/chemistry thresholds affect outcomes: higher chemistry = more wins
- [ ] Firing triggers at prestige ≤10%, offers appear on tier change, chemistry resets on club move
- [ ] Save/load works across page refresh, all 3 slots, auto-save fires after every match
- [ ] All 6 screens render and navigate correctly
- [ ] Dashboard events appear between matches with functional player choices
