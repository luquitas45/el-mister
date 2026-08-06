import { gainPrestige, losePrestige } from "../core/dt.js";
import { gainChemistry, loseChemistry } from "../core/chemistry.js";

export function signPlayers(dt, event, choice) {
  const chosen = event.choices[choice];
  let updated = { ...dt };

  if (chosen.effects) {
    if (chosen.effects.chemistry > 0) {
      updated = gainChemistry(updated, chosen.effects.chemistry);
    } else if (chosen.effects.chemistry < 0) {
      updated = loseChemistry(updated, Math.abs(chosen.effects.chemistry));
    }
    if (chosen.effects.prestige > 0) {
      updated = gainPrestige(updated, chosen.effects.prestige);
    } else if (chosen.effects.prestige < 0) {
      updated = losePrestige(updated, Math.abs(chosen.effects.prestige));
    }
  }

  return updated;
}
