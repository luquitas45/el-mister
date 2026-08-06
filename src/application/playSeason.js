import { playMatch } from "./playMatch.js";
import { generateOpponents, getSeasonOutcome } from "../core/league.js";
/**
 * Juega una temporada completa: 3 partidos y resultado final.
 * @param {object} state - { club, dt, teams, rng }
 * @returns {object} - { results: [], record: {wins,draws,losses}, outcome }
 */
export function playSeason(state) {
  const { club, dt, teams, rng } = state;
  const opponents = generateOpponents(teams, club.id, rng);
  let wins = 0;
  let draws = 0;
  let losses = 0;
  const results = [];
  for (const rival of opponents) {
    const match = playMatch(
      { name: club.name, rating: club.rating },
      { name: rival.name, rating: rival.rating },
      dt.chemistry,
      rng,
    );
    if (match.homeGoals > match.awayGoals) wins++;
    else if (match.homeGoals === match.awayGoals) draws++;
    else losses++;
    results.push({ rival: rival.name, ...match });
  }
  const outcome = getSeasonOutcome({ wins, draws, losses }, dt.league, rng);
  return { results, record: { wins, draws, losses }, outcome };
}
