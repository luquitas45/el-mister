import { GAME } from "../data/constants.js";

/**
 * Elige 3 rivales al azar sin repetir y sin incluir al usuario.
 * @param {Array} teams - Lista de equipos { id, name, rating }
 * @param {string} userTeamId
 * @param {() => number} rng
 * @returns {Array} 3 equipos rivales
 */
export function generateOpponents(teams, userTeamId, rng) {
  const rivals = teams.filter((t) => t.id !== userTeamId);
  const shuffled = [...rivals].sort(() => rng() - 0.5);
  return shuffled.slice(0, GAME.SEASON.MATCHES);
}

/**
 * Determina la zona según las victorias y la división.
 * @param {number} wins
 * @param {"ascenso"|"primera"} division
 * @returns {{ zone: number, label: string, min: number, max: number, outcome: string }}
 */
export function determineZone(wins, division) {
  const zones = GAME.LEAGUE[division].zones;
  for (const z of zones) {
    if (wins >= z.minWins) return z;
  }
  return zones[zones.length - 1]; // fallback: última zona
}

/**
 * Devuelve una posición random dentro de un rango.
 * @param {number} min
 * @param {number} max
 * @param {() => number} rng
 * @returns {number}
 */
export function getRandomPosition(min, max, rng) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * Resultado final de la temporada.
 * @param {{ wins: number, draws: number, losses: number }} record
 * @param {"ascenso"|"primera"} division
 * @param {() => number} rng
 * @returns {{ zone: object, position: number, outcome: string }}
 */
export function getSeasonOutcome(record, division, rng) {
  const zone = determineZone(record.wins, division);
  const position = getRandomPosition(zone.min, zone.max, rng);
  return { zone, position, outcome: zone.outcome };
}
