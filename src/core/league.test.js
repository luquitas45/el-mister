import { describe, it, expect } from "vitest";
import { determineZone, getRandomPosition, getSeasonOutcome, generateOpponents } from "./league.js";
import { createRNG } from "./rng.js";
describe("determineZone", () => {
  it("2+ victorias en ascenso → promoción directa", () => {
    const result = determineZone(2, "ascenso");
    expect(result.zone).toBe(1);
    expect(result.outcome).toBe("promoted");
  });
  it("1 victoria en ascenso → playoff", () => {
    const result = determineZone(1, "ascenso");
    expect(result.zone).toBe(2);
    expect(result.outcome).toBe("playoff");
  });
  it("0 victorias en ascenso → esperar", () => {
    const result = determineZone(0, "ascenso");
    expect(result.zone).toBe(3);
    expect(result.outcome).toBe("stay");
  });
  it("2+ victorias en primera → campeón", () => {
    const result = determineZone(3, "primera");
    expect(result.zone).toBe(1);
    expect(result.outcome).toBe("champion");
  });
  it("1 victoria en primera → media tabla", () => {
    const result = determineZone(1, "primera");
    expect(result.zone).toBe(2);
  });
  it("0 victorias en primera → descenso", () => {
    const result = determineZone(0, "primera");
    expect(result.zone).toBe(3);
    expect(result.outcome).toBe("relegated");
  });
});
describe("getRandomPosition", () => {
  it("devuelve un número dentro del rango", () => {
    const rng = createRNG(42);
    for (let i = 0; i < 20; i++) {
      const pos = getRandomPosition(4, 8, rng);
      expect(pos).toBeGreaterThanOrEqual(4);
      expect(pos).toBeLessThanOrEqual(8);
    }
  });
});
describe("getSeasonOutcome", () => {
  it("3 victorias en ascenso → promocion con puesto 1-3", () => {
    const rng = createRNG(42);
    const result = getSeasonOutcome({ wins: 3, draws: 0, losses: 0 }, "ascenso", rng);
    expect(result.outcome).toBe("promoted");
    expect(result.position).toBeGreaterThanOrEqual(1);
    expect(result.position).toBeLessThanOrEqual(3);
  });
});
describe("generateOpponents", () => {
  it("devuelve 3 rivales distintos, sin el usuario", () => {
    const teams = [
      { id: "u1", name: "Usuario" },
      { id: "t2", name: "Rival 2" },
      { id: "t3", name: "Rival 3" },
      { id: "t4", name: "Rival 4" },
      { id: "t5", name: "Rival 5" },
    ];
    const rng = createRNG(42);
    const rivals = generateOpponents(teams, "u1", rng);
    expect(rivals.length).toBe(3);
    expect(rivals.find((r) => r.id === "u1")).toBeUndefined();
  });
});
