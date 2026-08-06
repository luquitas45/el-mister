import { GAME } from "../data/constants.js";
export function getChemistryBonus(chemistry) {
  const index = Math.floor(chemistry / GAME.CHEMISTRY.STEP);
  const bounded = Math.min(index, GAME.CHEMISTRY.THRESHOLDS.length - 1);
  return GAME.CHEMISTRY.THRESHOLDS[bounded];
}
