import { describe, it, expect } from "vitest";
import { getChemistryBonus, gainChemistry, loseChemistry } from "./chemistry.js";

const dt = (chem) => ({ name: "Test", prestige: 50, chemistry: chem, league: "ascenso" });
describe("getChemistryBonus", () => {
  it("quimica 0 devuelve bonus 0", () => {
    expect(getChemistryBonus(0)).toBe(0);
  });
  it("quimica 19 devuelve bonus 0 (borde inferior)", () => {
    expect(getChemistryBonus(19)).toBe(0);
  });
  it("quimica 20 devuelve bonus 3 (primer salto)", () => {
    expect(getChemistryBonus(20)).toBe(3);
  });
  it("quimica 50 devuelve bonus 6", () => {
    expect(getChemistryBonus(50)).toBe(6);
  });
  it("quimica 80 devuelve bonus 12 (umbral maximo)", () => {
    expect(getChemistryBonus(80)).toBe(12);
  });
  it("quimica 100 devuelve bonus 12 (no se pasa)", () => {
    expect(getChemistryBonus(100)).toBe(12);
  });
});

describe("gainChemistry", () => {
  it("suma quimica sin pasarse de 100", () => {
    const result = gainChemistry(dt(90), 20);
    expect(result.chemistry).toBe(100);
  });

  it("no modifica el original", () => {
    const original = dt(40);
    const result = gainChemistry(original, 5);
    expect(original.chemistry).toBe(40);
    expect(result.chemistry).toBe(45);
  });
});

describe("loseChemistry", () => {
  it("resta quimica sin bajar de 0", () => {
    const result = loseChemistry(dt(5), 10);
    expect(result.chemistry).toBe(0);
  });

  it("no modifica el original", () => {
    const original = dt(40);
    const result = loseChemistry(original, 5);
    expect(original.chemistry).toBe(40);
    expect(result.chemistry).toBe(35);
  });
});
