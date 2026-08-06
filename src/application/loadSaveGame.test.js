import { describe, it, expect, beforeEach } from "vitest";
import { save } from "./saveGame.js";
import { load } from "./loadGame.js";
beforeEach(() => {
  const store = {};
  globalThis.localStorage = {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
  };
});
describe("saveGame y loadGame", () => {
  it("guarda y carga con campo version", () => {
    const state = { dt: { name: "Lucas" }, season: { matchday: 1 } };
    save(1, state);
    const loaded = load(1);
    expect(loaded.dt.name).toBe("Lucas");
    expect(loaded.season.matchday).toBe(1);
  });
  it("rechaza saves sin campos requeridos", () => {
    // Guardamos algo inválido directo en storage
    localStorage.setItem("el-mister:slot:1", JSON.stringify({ dt: "falta season" }));
    expect(load(1)).toBeNull();
  });
  it("devuelve null para slots vacíos", () => {
    expect(load(3)).toBeNull();
  });
});
