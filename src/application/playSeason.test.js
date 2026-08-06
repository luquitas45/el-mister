import { describe, it, expect } from "vitest";
import { playSeason } from "./playSeason.js";
import { createRNG } from "../core/rng.js";
describe("playSeason", () => {
  it("devuelve 3 partidos y un outcome", () => {
    const state = {
      club: { id: "t1", name: "Tu club", rating: 75 },
      dt: { chemistry: 50, league: "ascenso" },
      teams: [
        { id: "t1", name: "Tu club", rating: 75 },
        { id: "t2", name: "Rival A", rating: 70 },
        { id: "t3", name: "Rival B", rating: 65 },
        { id: "t4", name: "Rival C", rating: 60 },
        { id: "t5", name: "Rival D", rating: 55 },
      ],
      rng: createRNG(42),
    };
    const result = playSeason(state);
    expect(result.results.length).toBe(3);
    expect(result.record.wins).toBeGreaterThanOrEqual(0);
    expect(result.record.draws).toBeGreaterThanOrEqual(0);
    expect(result.record.losses).toBeGreaterThanOrEqual(0);
    expect(result.outcome.outcome).toBeDefined();
    expect(result.outcome.position).toBeDefined();
  });
  it("no enfrenta al equipo del usuario", () => {
    const state = {
      club: { id: "u1", name: "Tu club", rating: 75 },
      dt: { chemistry: 50, league: "ascenso" },
      teams: [
        { id: "u1", name: "Tu club", rating: 75 },
        { id: "t2", name: "Rival A", rating: 70 },
        { id: "t3", name: "Rival B", rating: 65 },
        { id: "t4", name: "Rival C", rating: 60 },
      ],
      rng: createRNG(42),
    };
    const result = playSeason(state);
    result.results.forEach((r) => {
      expect(r.rival).not.toBe("Tu club");
    });
  });
});
