import { describe, it, expect } from "vitest";
import { getChemistryBonus } from "./chemistry.js";
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
