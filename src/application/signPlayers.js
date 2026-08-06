import { gainPrestige, losePrestige } from "../core/dt.js";

export function signPlayers(dt, event, choice) {
  const chosen = event.choices[choice]; // 0 = sí, 1 = no
  let updated = { ...dt };
  if (chosen.effects) {
    if (chosen.effects.chemistry) {
      updated.chemistry = Math.min(100, Math.max(0, dt.chemistry + chosen.effects.chemistry));
    }
    if (chosen.effects.prestige && chosen.effects.prestige > 0) {
      updated = gainPrestige(updated, chosen.effects.prestige);
    }
    if (chosen.effects.prestige && chosen.effects.prestige < 0) {
      updated = losePrestige(updated, Math.abs(chosen.effects.prestige));
    }
  }
  return updated;
}
