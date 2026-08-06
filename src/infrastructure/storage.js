const PREFIX = "el-mister:slot:";

export function saveGame(slot, data) {
  const key = PREFIX + slot;
  localStorage.setItem(key, JSON.stringify(data));
}
export function loadGame(slot) {
  const key = PREFIX + slot;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null; // corrupt data → discard
  }
}

export function deleteGame(slot) {
  const key = PREFIX + slot;
  localStorage.removeItem(key);
}
