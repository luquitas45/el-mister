import { getTier } from "../core/dt.js";
/**
 * Cambia de club y aplica las reglas de química y prestigio.
 * @param {object} dt
 * @param {object} newClub
 * @returns {object} dt actualizado
 */
export function changeClub(dt, newClub) {
  const isBetterLeague = newClub.league !== dt.league;
  return {
    ...dt,
    club: newClub.id,
    chemistry: 0,                    // química siempre se resetea al cambiar club
    prestige: isBetterLeague ? 50 : dt.prestige,  // prestigio a 50 si es mejor liga
    league: newClub.league,
  };
}
/**
 * Cuando te despiden: bajás un tier y recibís ofertas.
 * @param {object} dt
 * @param {Array} allClubs - todos los clubes disponibles
 * @param {() => number} rng
 * @returns {Array} 3 ofertas de clubes del tier inferior
 */
export function getJobOffers(dt, allClubs) {
  const currentTier = getTier(dt).tier;
  const nextTier = Math.max(1, currentTier - 1);
  const eligible = allClubs.filter((c) => {
    // clubes del tier inferior que estén en ascenso
    return c.tier === nextTier && c.league === "ascenso";
  });
  // devolver hasta 3 al azar
  const shuffled = [...eligible].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}
