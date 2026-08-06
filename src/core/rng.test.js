import { describe, it, expect } from "vitest";
import { createRNG } from "./rng.js";
describe("createRNG", () => {
  it("mismo seed devuelve la misma secuencia", () => {
    const rng1 = createRNG(42);
    const rng2 = createRNG(42);
    const seq1 = [rng1(), rng1(), rng1()];
    const seq2 = [rng2(), rng2(), rng2()];
    expect(seq1).toEqual(seq2);
  });
  it("distinto seed devuelve distinta secuencia", () => {
    const rng1 = createRNG(42);
    const rng2 = createRNG(99);
    expect(rng1()).not.toBe(rng2());
  });
});
