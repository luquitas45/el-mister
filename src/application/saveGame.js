import { saveGame as persist } from "../infrastructure/storage.js";
const SAVE_VERSION = 1;
/**
 * Guarda el estado completo del juego con versión para migraciones.
 * @param {number} slot - 1, 2 o 3
 * @param {object} state - { dt, season, club }
 */
export function save(slot, state) {
  const wrapped = { version: SAVE_VERSION, ...state };
  persist(slot, wrapped);
}
