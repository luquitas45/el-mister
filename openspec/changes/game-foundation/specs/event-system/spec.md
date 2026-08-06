# Event System Specification

## Purpose

Match events and dashboard events that inject narrative choices into gameplay, modifying prestige, chemistry, or goal probability.

## Requirements

| # | Requirement | Key Scenarios |
|---|------------|---------------|
| R1 | Match event structure | Up to 5 match events MAY fire per match: 2 in the 1st half, 1 at half-time, and 2 in the 2nd half. Each slot has a probability threshold — events are not guaranteed. |
| R2 | Event effects | Match events SHALL modify goal probability, prestige, or chemistry for the remainder of the match. |
| R3 | Player choice | Every event that fires MUST present the player with at least 2 options to choose between. |
| R4 | Dashboard events | Between matches, random dashboard events SHALL appear with player choices affecting prestige or chemistry. |
| R5 | Event catalog | Events SHALL be drawn from a data-driven catalog (plain objects), not hardcoded in logic. |

### Scenario: Match event fires in 1st half

- GIVEN a match in progress during the 1st half
- WHEN a moment slot passes its probability threshold
- THEN an event fires, the player is shown 2+ options, and the chosen option modifies goal probability, prestige, or chemistry for the rest of the match

### Scenario: Match event slot produces no event

- GIVEN a match moment slot with a low probability threshold
- WHEN the slot is evaluated and the RNG roll exceeds the threshold
- THEN no event fires and the match continues directly to the next moment

### Scenario: Dashboard event between matches

- GIVEN a DT in the dashboard between match 2 and match 3 of a season
- WHEN the dashboard is rendered
- THEN a random event is drawn from the catalog and presented with 2+ choices

### Scenario: Event choice modifies prestige

- GIVEN a dashboard event where the player chooses option A (gain prestige, lose chemistry)
- WHEN the choice is committed
- THEN prestige increases by the defined amount and chemistry decreases by the defined amount
