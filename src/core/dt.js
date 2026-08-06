import { GAME } from "../data/constants.js";

export function createDT(name) {
	return {
	    name: name,
	    prestige: GAME.PRESTIGE.INITIAL,
	    chemistry: 0,
	    league: "ascenso",
	  };
}

export function gainPrestige(dt, amount) {
  const nuevoPrestige = Math.min(100, dt.prestige + amount);
  return { ...dt, prestige: nuevoPrestige };
}

export function losePrestige(dt, amount) {
  const nuevoPrestige = Math.max(0, dt.prestige + amount);
  return { ...dt, prestige: nuevoPrestige };
}

export function getTier(dt) {
  for (const t of GAME.TIERS) {
  	if (dt.prestige >= t.min && dt.prestige <= t.max) {
  		return t;
  	}
  }
  return GAME.TIERS[0];
}

export function isFired(dt) {
  return dt.prestige <= 10;
}

export function isGameOver(dt) {
  return isFired(dt) && dt.league === "ascenso";
}
