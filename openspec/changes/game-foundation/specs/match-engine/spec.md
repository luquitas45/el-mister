# Match Engine Specification

## Purpose

8-moment simulation engine producing scorelines through probability-based goal events, with seeded reproducibility and knockout support.

## Requirements

| # | Requirement | Key Scenarios |
|---|------------|---------------|
| R1 | Match structure | A match MUST consist of exactly 8 moments: 4 in the first half and 4 in the second half. |
| R2 | Half-time break | A half-time break SHALL occur between moments 3 and 4 (after the 4th moment of the first half). |
| R3 | Goal probability | Each moment SHALL resolve a goal-or-not decision using: home base media + away base media + chemistry modifier, converted to a probability. |
| R4 | Seeded RNG | All randomness MUST use a seeded RNG, making matches reproducible given the same seed and inputs. |
| R5 | Goal attribution | A goal SHALL be attributed to either the home or away side based on the relative strength of their media modifiers at that moment. |
| R6 | Knockout draw resolution | For knockout (non-league) matches ending in a draw, the match SHALL go to penalties: 5 rounds plus sudden death until a winner emerges. |
| R7 | Scoreline output | The match MUST produce a final scoreline (home goals, away goals) plus a per-moment log. |

### Scenario: Full match produces 8 moments

- GIVEN a seeded RNG and two opposing teams
- WHEN a match is simulated
- THEN exactly 8 moments are resolved, producing two halves of 4 moments each

### Scenario: Half-time break between halves

- GIVEN a match in progress
- WHEN moment 3 of the first half completes
- THEN a half-time break is signaled before moment 4 (second half) begins

### Scenario: Chemistry modifier affects goal probability

- GIVEN a DT with chemistry 60 (+9 media bonus) and an opponent with neutral media
- WHEN match moments are resolved
- THEN the DT's side has a higher goal probability than if chemistry were 0

### Scenario: Draw goes to penalties in knockout

- GIVEN a knockout match ending in a draw after all 8 moments
- WHEN the match resolution continues
- THEN 5 rounds of penalties are simulated, followed by sudden death if still tied

### Scenario: Seeded RNG produces deterministic match

- GIVEN the same seed, same teams, and same DT state
- WHEN the match is simulated twice
- THEN both simulations produce identical moment-by-moment results
