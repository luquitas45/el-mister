import { describe, it, expect } from "vitest";
import { playMatch } from "./playMatch.js";
import { createRNG } from "../core/rng.js";
describe("playMatch", () => {
  it("devuelve 8 momentos", () => {
    const rng = createRNG(42);
    const result = playMatch(
      { name: "Local", rating: 75 },
      { name: "Visitante", rating: 70 },
      50,
      rng,
    );
    expect(result.moments.length).toBe(8);
    expect(result.homeGoals).toBeGreaterThanOrEqual(0);
  });
});
