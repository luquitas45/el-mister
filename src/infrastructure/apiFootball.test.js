import { describe, it, expect, beforeEach, vi } from "vitest";
import { fetchTeams } from "./apiFootball.js";
// Mock de import.meta.env
vi.stubEnv("VITE_RAPIDAPI_KEY", "test-key");
beforeEach(() => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          response: [
            { team: { id: 1, name: "Club A", logo: "logo-a.png" } },
            { team: { id: 2, name: "Club B", logo: "logo-b.png" } },
          ],
        }),
    }),
  );
});
describe("fetchTeams", () => {
  it("devuelve equipos transformados", async () => {
    const teams = await fetchTeams();
    expect(teams.length).toBe(2);
    expect(teams[0].name).toBe("Club A");
    expect(teams[0].rating).toBeDefined();
  });
});
