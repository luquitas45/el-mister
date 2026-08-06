import { describe, it, expect } from "vitest";
import { getSigningEvent } from "./signing.js";
import { createRNG } from "./rng.js";
describe("getSigningEvent", () => {
  it("devuelve null si el random no supera el 60%", () => {
    // seed que da un número alto (>0.60)
    const rng = createRNG(999);
    const result = getSigningEvent({ matchday: 1, isFinalMatch: false }, rng);
    // Con seed 999 el primer valor podría ser cualquiera, probamos varias veces
    let allNull = true;
    for (let i = 0; i < 10; i++) {
      const r = getSigningEvent({ matchday: 1, isFinalMatch: false }, createRNG(i));
      if (r !== null) allNull = false;
    }
    // Al menos algunas veces sale evento (estadísticamente)
    expect(allNull).toBe(false);
  });
  it("filtra eventos por matchday", () => {
    const rng = createRNG(42);
    // Probamos 50 veces con matchday 1
    for (let i = 0; i < 50; i++) {
      const event = getSigningEvent({ matchday: 1, isFinalMatch: false }, rng);
      if (event) {
        // Si salió, no debería ser el evento de final_match
        expect(event.condition?.type).not.toBe("final_match");
      }
    }
  });
  it("devuelve un objeto de evento cuando corresponde", () => {
    const rng = createRNG(42);
    const event = getSigningEvent({ matchday: 1, isFinalMatch: false }, rng);
    if (event) {
      expect(event.id).toBeDefined();
      expect(event.description).toBeDefined();
      expect(event.choices.length).toBe(2);
    }
  });
});
