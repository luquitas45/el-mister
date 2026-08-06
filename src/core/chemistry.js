import { GAME } from "../data/constants.js";

export function getChemistryBonus(chemistry) {
  const index = Math.floor(chemistry / GAME.CHEMISTRY.STEP);
  const bounded = Math.min(index, GAME.CHEMISTRY.THRESHOLDS.length - 1);
  return GAME.CHEMISTRY.THRESHOLDS[bounded];
}

export function gainChemistry(dt, amount) {
  const nuevo = Math.min(100, dt.chemistry + amount);
  return { ...dt, chemistry: nuevo };
}

export function loseChemistry(dt, amount) {
  const nuevo = Math.max(0, dt.chemistry - amount);
  return { ...dt, chemistry: nuevo };
}
