import { simulateMatch, getGoalProbabilities } from "../core/match.js";
/**
 * Juega un partido completo.
 * @param {object} homeTeam - { name, rating }
 * @param {object} awayTeam - { name, rating }
 * @param {number} chemistry - Química del DT (0-100)
 * @param {() => number} rng
 * @returns {{ homeGoals: number, awayGoals: number, moments: Array }}
 */
export function playMatch(homeTeam, awayTeam, chemistry, rng) {
  return simulateMatch(homeTeam, awayTeam, chemistry, rng);
}
