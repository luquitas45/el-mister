import { describe, it, expect, beforeEach } from "vitest";
import { saveGame, loadGame, deleteGame } from "./storage.js";
// Mock de localStorage
beforeEach(() => {
  const store = {};
  globalThis.localStorage = {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
  };
});
describe("saveGame y loadGame", () => {
  it("guarda y carga en el slot 1", () => {
    const data = { dt: { name: "Lucas", prestige: 50 } };
    saveGame(1, data);
    const loaded = loadGame(1);
    expect(loaded).toEqual(data);
  });
  it("devuelve null si el slot está vacío", () => {
    expect(loadGame(2)).toBeNull();
  });
  it("guarda en slots distintos sin pisarse", () => {
    saveGame(1, { slot: 1 });
    saveGame(2, { slot: 2 });
    expect(loadGame(1)).toEqual({ slot: 1 });
    expect(loadGame(2)).toEqual({ slot: 2 });
  });
});
describe("deleteGame", () => {
  it("borra el save del slot", () => {
    saveGame(1, { data: "test" });
    deleteGame(1);
    expect(loadGame(1)).toBeNull();
  });
});
