# DT Management Specification

## Purpose

The DT (Director Técnico) entity drives progression: a coach with prestige and chemistry whose lifecycle spans club changes, tier progression, firing, and game over.

## Requirements

| # | Requirement | Key Scenarios |
|---|------------|---------------|
| R1 | DT identity | DT MUST have a name, prestige (0–100 continuous), and chemistry (0–100 continuous). |
| R2 | Chemistry tiers | Chemistry SHALL gate a media bonus in 5 tiers: 0–19→+0, 20–39→+3, 40–59→+6, 60–79→+9, 80–100→+12. |
| R3 | Prestige gains | Prestige MUST increase on wins (+N, configurable) and titles (+M, configurable). |
| R4 | Prestige losses | Prestige MUST decrease on defeats only. No passive decay. |
| R5 | Club change—chemistry | Chemistry SHALL reset to 0 on every club change. |
| R6 | Club change—prestige | Prestige SHALL persist when moving clubs within the same league; prestige SHALL reset to 50 when moving to a higher league. |
| R7 | Tier progression | The DT's prestige SHALL be compared against 5 tier thresholds to determine the current tier. Tiers control available clubs (see club-system). |
| R8 | Firing | When prestige falls to ≤ 10, the DT MUST be fired: drop one tier and receive random club offers from the new tier. |
| R9 | Game over | Game over SHALL trigger when prestige is at its minimum (0) AND the DT is in the Ascenso league. |

### Scenario: Chemistry tier bonus updates on value change

- GIVEN a DT with chemistry 45
- WHEN chemistry is queried for the media bonus
- THEN the bonus returned is +6 (tier 3: 40–59)

### Scenario: Prestige gains from a win

- GIVEN a DT with prestige 60 and a win result
- WHEN the match concludes
- THEN prestige increases by the configured win gain amount

### Scenario: Prestige does not decay passively

- GIVEN a DT with prestige 50 and no matches played for a season
- WHEN the season ends
- THEN prestige remains 50

### Scenario: Chemistry resets on club change

- GIVEN a DT with chemistry 75 moving to a new club in the same league
- WHEN the club change is executed
- THEN chemistry becomes 0 and prestige is unchanged

### Scenario: Prestige resets to 50 when moving to a better league

- GIVEN a DT with prestige 80 moving from Ascenso to Primera
- WHEN the club change is executed
- THEN prestige becomes 50 and chemistry becomes 0

### Scenario: Firing triggers at prestige ≤ 10

- GIVEN a DT with prestige 9
- WHEN the DT finishes a match (loss) that would keep prestige ≤ 10
- THEN the DT is fired, drops one tier, and receives random club offers from the new tier

### Scenario: Game over in Ascenso at minimum prestige

- GIVEN a DT with prestige 0 in the Ascenso league
- WHEN game state is evaluated
- THEN game over is detected, career summary and final result are displayed
