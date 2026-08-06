import { SIGNING_EVENTS } from "../data/events.js";
/**
 * Determina si hay evento de fichaje esta temporada y cuál.
 * @param {object} context - { matchday, isFinalMatch, division }
 * @param {() => number} rng
 * @returns {object|null} evento de fichaje o null
 */
export function getSigningEvent(context, rng) {
  const SIGNING_CHANCE = 0.60;
  if (rng() > SIGNING_CHANCE) return null;
  const eligible = SIGNING_EVENTS.filter((e) => {
    if (!e.condition) return true;
    if (e.condition.type === "matchday" && e.condition.value === context.matchday) return true;
    if (e.condition.type === "final_match" && context.isFinalMatch) return true;
    return false;
  });
  if (eligible.length === 0) return null;
  const index = Math.floor(rng() * eligible.length);
  return eligible[index];
}
