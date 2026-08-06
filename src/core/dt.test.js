import { describe, it, expect } from "vitest";
import { createDT, gainPrestige, losePrestige, getTier, isFired, isGameOver } from "./dt.js";
describe("createDT", () => {
  it("crea un DT con nombre, prestigio 50, quimica 0, liga ascenso", () => {
    const dt = createDT("Lucas");
    expect(dt.name).toBe("Lucas");
    expect(dt.prestige).toBe(50);
    expect(dt.chemistry).toBe(0);
    expect(dt.league).toBe("ascenso");
  });
});
describe("gainPrestige", () => {
  it("suma prestigio sin pasarse de 100", () => {
    const dt = createDT("Lucas");
    const result = gainPrestige(dt, 20);
    expect(result.prestige).toBe(70);
    expect(dt.prestige).toBe(50); // el original no cambió
  });
  it("no se pasa de 100", () => {
    const dt = { ...createDT("Lucas"), prestige: 95 };
    const result = gainPrestige(dt, 20);
    expect(result.prestige).toBe(100);
  });
});
describe("losePrestige", () => {
  it("resta prestigio sin bajar de 0", () => {
    const dt = createDT("Lucas");
    const result = losePrestige(dt, -10);
    expect(result.prestige).toBe(40);
  });
  it("no baja de 0", () => {
    const dt = { ...createDT("Lucas"), prestige: 5 };
    const result = losePrestige(dt, -10);
    expect(result.prestige).toBe(0);
  });
});
