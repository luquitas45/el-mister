import { describe, it, expect } from "vitest";
import { signPlayers } from "./signPlayers.js";
import { changeClub, getJobOffers } from "./changeClub.js";
describe("signPlayers", () => {
  it("aplica efecto de quimica al elegir si", () => {
    const dt = { name: "Lucas", prestige: 50, chemistry: 40 };
    const event = {
      choices: [
        { text: "Ficharlo", effects: { chemistry: 5 } },
        { text: "No", effects: {} },
      ],
    };
    const updated = signPlayers(dt, event, 0);
    expect(updated.chemistry).toBe(45);
  });
  it("no cambia nada al elegir no", () => {
    const dt = { name: "Lucas", prestige: 50, chemistry: 40 };
    const event = {
      choices: [
        { text: "Ficharlo", effects: { chemistry: 5 } },
        { text: "No", effects: {} },
      ],
    };
    const updated = signPlayers(dt, event, 1);
    expect(updated.chemistry).toBe(40);
  });
});
describe("changeClub", () => {
  it("resetea quimica al cambiar de club", () => {
    const dt = { name: "Lucas", prestige: 60, chemistry: 80, league: "ascenso" };
    const newClub = { id: "c2", league: "primera" };
    const updated = changeClub(dt, newClub);
    expect(updated.chemistry).toBe(0);
  });
  it("resetea prestigio a 50 si va a mejor liga", () => {
    const dt = { name: "Lucas", prestige: 70, chemistry: 80, league: "ascenso" };
    const newClub = { id: "c2", league: "primera" };
    const updated = changeClub(dt, newClub);
    expect(updated.prestige).toBe(50);
  });
  it("mantiene prestigio si misma liga", () => {
    const dt = { name: "Lucas", prestige: 70, chemistry: 80, league: "ascenso" };
    const newClub = { id: "c2", league: "ascenso" };
    const updated = changeClub(dt, newClub);
    expect(updated.prestige).toBe(70);
  });
});
describe("getJobOffers", () => {
it("devuelve clubes del tier inferior", () => {
    const dt = { prestige: 85 }; // tier 5
    const clubs = [
      { id: "c1", tier: 1, league: "ascenso" },
      { id: "c2", tier: 1, league: "ascenso" },
      { id: "c3", tier: 4, league: "ascenso" },
      { id: "c4", tier: 4, league: "ascenso" },
    ];
    const offers = getJobOffers(dt, clubs);
    expect(offers.length).toBe(2);
    offers.forEach((c) => {
      expect(c.tier).toBe(4);
    });
  });
});

