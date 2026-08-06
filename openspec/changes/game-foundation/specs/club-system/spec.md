# Club System Specification

## Purpose

Club selection and lifecycle: real Primera Nacional Argentina clubs from API-Football, tier-gated availability, job offers, and firing mechanics.

## Requirements

| # | Requirement | Key Scenarios |
|---|------------|---------------|
| R1 | API-Football data | Club names, logos, and ratings MUST be fetched from API-Football via RapidAPI for Primera Nacional Argentina. |
| R2 | Two divisions | The system SHALL model 2 divisions: Primera (first) and Ascenso (second). |
| R3 | Tier gating | Clubs available for selection SHALL be filtered by the DT's current tier (1–5), gated by prestige thresholds defined in dt-management. |
| R4 | Club selection | On new game, the DT MAY choose from clubs matching their tier in the Ascenso division. |
| R5 | Job offers on firing | When fired (prestige ≤ 10), the DT MUST receive random club offers from the tier below their current one. |
| R6 | Job offers on tier-up | When the DT's prestige crosses a tier threshold upward, the DT SHALL receive random club offers from the new tier. |
| R7 | Chemistry reset | Changing clubs MUST reset DT chemistry to 0 (see dt-management R5). |
| R8 | Club ratings impact | Club rating SHALL influence match goal probability as a base modifier. |

### Scenario: Club filtering by tier

- GIVEN a DT at tier 2 (prestige 20–39)
- WHEN available clubs are queried
- THEN only clubs whose tier matches tier 2 appear in the selection list

### Scenario: Firing offers from lower tier

- GIVEN a DT at tier 3 who is fired
- WHEN job offers are generated
- THEN all offers belong to tier 2 clubs

### Scenario: Tier-up offers from new tier

- GIVEN a DT whose prestige crosses from tier 2 into tier 3 (≥ 40)
- WHEN job offers are generated
- THEN all offers belong to tier 3 clubs

### Scenario: Chemistry resets on offer acceptance

- GIVEN a DT with chemistry 60 accepting a new club offer
- WHEN the club change is committed
- THEN chemistry becomes 0

### Scenario: Initial club selection starts in Ascenso

- GIVEN a new game is started
- WHEN the DT selects a club
- THEN the club belongs to the Ascenso division
