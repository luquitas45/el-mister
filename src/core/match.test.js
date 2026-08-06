import { describe, it, expect } from "vitest";
import { simulateMatch, getGoalProbabilities } from "./match.js";
import { createRNG } from "./rng.js";
describe("getGoalProbabilities", () => {
  it("la quimica beneficia al equipo del DT", () => {
    const low = getGoalProbabilities(70, 70, 0);
    const high = getGoalProbabilities(70, 70, 80);
    expect(high.homeChance).toBeGreaterThan(low.homeChance);
  });
});
describe("simulateMatch", () => {
  it("devuelve 8 momentos con goles y resultado", () => {
    const rng = createRNG(42);
    const result = simulateMatch(
      { name: "Tu equipo", rating: 75 },
      { name: "Rival", rating: 70 },
      50,
      rng,
    );
    expect(result.moments.length).toBe(8);
    expect(result.homeGoals + result.awayGoals).toBeGreaterThanOrEqual(0);
    expect(result.homeGoals + result.awayGoals).toBeLessThanOrEqual(8);
  });
  it("los primeros 4 momentos son primer tiempo", () => {
    const rng = createRNG(42);
    const result = simulateMatch(
      { name: "Tu equipo", rating: 75 },
      { name: "Rival", rating: 70 },
      50,
      rng,
    );
    result.moments.slice(0, 4).forEach((m) => {
      expect(m.half).toBe(1);
    });
    result.moments.slice(4).forEach((m) => {
      expect(m.half).toBe(2);
    });
  });
});
