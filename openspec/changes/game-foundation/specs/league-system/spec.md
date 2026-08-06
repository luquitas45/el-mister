# League System Specification

## Purpose

Two-division league structure with 3-match seasons, standings, and promotion/relegation rules.

## Requirements

| # | Requirement | Key Scenarios |
|---|------------|---------------|
| R1 | Two divisions | The league SHALL consist of exactly two divisions: Primera and Ascenso. |
| R2 | Season length | Each season MUST consist of 3 matches against simulated opponents. |
| R3 | Points system | A win SHALL award 3 points, a draw 1 point, and a loss 0 points. |
| R4 | Standings sort | Standings MUST be sorted by: points (desc) → goal difference (desc) → goals for (desc). |
| R5 | Primera outcomes | In Primera: top N positions SHALL qualify as champion/Libertadores, middle positions get nothing, bottom N are relegated to Ascenso. |
| R6 | Ascenso outcomes | In Ascenso: top N positions SHALL be promoted to Primera, middle positions enter a playoff, bottom positions stay. |
| R7 | Promotion/relegation | After each season, promotion and relegation SHALL be applied before the signing phase. |

### Scenario: Season consists of 3 matches

- GIVEN a new season starts
- WHEN the season is played to completion
- THEN exactly 3 matches are generated and resolved

### Scenario: Standings sorted by points then goal difference

- GIVEN two teams tied on points after a season, with different goal differences
- WHEN standings are computed
- THEN the team with the higher goal difference is ranked above the other

### Scenario: Standings sorted by points then goal difference then goals for

- GIVEN two teams tied on points and goal difference
- WHEN standings are computed
- THEN the team with more goals scored is ranked above the other

### Scenario: Relegation from Primera

- GIVEN a DT in Primera whose team finishes in the bottom N positions
- WHEN the season ends and promotion/relegation is applied
- THEN the DT is relegated to Ascenso

### Scenario: Promotion from Ascenso

- GIVEN a DT in Ascenso whose team finishes in the top N positions
- WHEN the season ends and promotion/relegation is applied
- THEN the DT is promoted to Primera
