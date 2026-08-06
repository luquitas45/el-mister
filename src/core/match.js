import { getChemistryBonus } from "./chemistry.js";

/**
 * Calcula la probabilidad de que haya un gol en un momento.
 * @param {number} homeRating - Media del local
 * @param {number} awayRating - Media del visitante
 * @param {number} chemistry - Química del DT (0-100)
 * @returns {{ homeChance: number, awayChance: number }}
 */
export function getGoalProbabilities(homeRating, awayRating, chemistry) {
  const bonus = getChemistryBonus(chemistry);   // bonus de media (0, 3, 6, 9 o 12)
  const adjustedHome = homeRating + bonus;       // la química solo beneficia al equipo del DT
  const total = adjustedHome + awayRating;
  const baseChance = 0.30;                       // 30% de que pase algo en este momento
  const homeChance = (adjustedHome / total) * baseChance;
  const awayChance = (awayRating / total) * baseChance;
  return { homeChance, awayChance };
}

export function simulateMatch(homeTeam, awayTeam, chemistry, rng) {
  let homeGoals = 0;
  let awayGoals = 0;
  const moments = [];
  for (let i = 0; i < 8; i++) {
    const half = i < 4 ? 1 : 2;
    const { homeChance, awayChance } = getGoalProbabilities(
      homeTeam.rating, awayTeam.rating, chemistry
    );
    const roll = rng(); // número random entre 0 y 1
    if (roll < homeChance) {
      homeGoals++;
      moments.push({ half, index: i, type: "goal_home", description: "¡GOL del local!" });
    } else if (roll < homeChance + awayChance) {
      awayGoals++;
      moments.push({ half, index: i, type: "goal_away", description: "Gol del visitante..." });
    } else {
      moments.push({ half, index: i, type: "nothing", description: "Sin novedades." });
    }
  }
  return { homeGoals, awayGoals, moments };
}
