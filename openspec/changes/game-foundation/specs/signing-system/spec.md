# Signing System Specification

## Purpose

Annual signing phase after each season: the DT chooses to sign one player (with chemistry disruption) or skip, with hooks for future event unlocks.

## Requirements

| # | Requirement | Key Scenarios |
|---|------------|---------------|
| R1 | Signing trigger | The signing phase MUST occur once per year, after the season ends and before the next season begins. |
| R2 | Player pool | A pool of signable players SHALL be presented, each with a potential chemistry modifier (positive or negative). |
| R3 | Sign choice | The DT MAY choose to sign exactly one player or skip the signing phase entirely. |
| R4 | Chemistry impact | Signing a player SHALL modify the DT's chemistry by the player's defined modifier (± configurable values). |
| R5 | Skip preserves chemistry | Skipping the signing phase MUST leave chemistry unchanged. |
| R6 | Signed player persistence | Signed players SHALL persist between seasons and be included in save data. |
| R7 | Event hooks | Signed players SHALL carry event unlock attributes (specific events TBD) so the event system can reference them later. |

### Scenario: Sign a player with positive chemistry

- GIVEN a signing pool with a player offering +8 chemistry
- WHEN the DT chooses to sign that player
- THEN chemistry increases by 8 and the player is recorded in the DT's signed players list

### Scenario: Sign a player with negative chemistry

- GIVEN a signing pool with a player offering -5 chemistry
- WHEN the DT chooses to sign that player
- THEN chemistry decreases by 5 and the player is recorded in the DT's signed players list

### Scenario: Skip signing phase

- GIVEN a signing pool of 3 players
- WHEN the DT chooses to skip
- THEN chemistry is unchanged and no player is added to the signed players list

### Scenario: Signing phase occurs after season end

- GIVEN a completed season (3 matches played, standings resolved, promotion/relegation applied)
- WHEN the season concludes
- THEN the signing phase is triggered before the next season starts

### Scenario: Signed players persist across seasons

- GIVEN a DT with 2 signed players from previous seasons
- WHEN a new season begins
- THEN both signed players remain in the DT's roster
