import { loadGame as retrieve } from "../infrastructure/storage.js";
const REQUIRED_FIELDS = ["dt", "season"];
/**
 * Carga y valida un save del slot indicado.
 * @param {number} slot
 * @returns {object|null} estado del juego o null si es inválido
 */
export function load(slot) {
  const data = retrieve(slot);
  if (!data) return null;
  const hasAllFields = REQUIRED_FIELDS.every((f) => f in data);
  if (!hasAllFields) return null;
  return data;
}
