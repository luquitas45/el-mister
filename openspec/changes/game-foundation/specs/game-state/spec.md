# Game State Specification

## Purpose

localStorage-based persistence with 3 save slots, auto-save triggers, save validation, version migration, and game-over detection.

## Requirements

| # | Requirement | Key Scenarios |
|---|------------|---------------|
| R1 | Save slots | The system MUST support 3 independent save slots stored in localStorage under namespaced keys. |
| R2 | Save contents | Each save SHALL contain: full DT state, current season state, match progress, signed players, and event history. |
| R3 | Version field | Every save MUST include a version field for future schema migration. |
| R4 | Auto-save | The system MUST auto-save after every match result (win, loss, or draw). |
| R5 | Manual save/load | The DT MAY manually save to and load from any of the 3 slots. |
| R6 | Integrity validation | On load, the system SHALL validate save integrity (required fields, valid ranges). Corrupt saves MUST be discarded with an error message. |
| R7 | Migration | When a save is loaded with an older version, a migration function SHALL transform it to the current schema before use. |
| R8 | Game over detection | The system SHALL detect game over when prestige is at minimum (0) AND the DT is in the Ascenso league. |

### Scenario: Auto-save after match result

- GIVEN a match that just concluded with a final scoreline
- WHEN the result screen is shown
- THEN the current game state is auto-saved to the active slot

### Scenario: Load a valid save

- GIVEN save slot 1 contains valid game data with correct version and all required fields
- WHEN the player loads slot 1
- THEN the game state is fully restored including DT, season, match progress, and signed players

### Scenario: Load a corrupt save is discarded

- GIVEN save slot 2 contains data with missing required fields or invalid value ranges
- WHEN the player attempts to load slot 2
- THEN the load is rejected, an error message is displayed, and the slot data is NOT loaded into the game

### Scenario: Save version migration

- GIVEN save slot 3 has version 1 and the current schema is version 2
- WHEN the player loads slot 3
- THEN the migration function transforms the data from version 1 to version 2 before using it

### Scenario: Game over detection

- GIVEN a DT with prestige 0 in the Ascenso league
- WHEN the game state is evaluated
- THEN game over is detected and the career summary screen is displayed

### Scenario: Three independent slots

- GIVEN saves in slot 1 and slot 2 with different DT names
- WHEN the player loads slot 1 then slot 2
- THEN each load restores the correct, independent game state
