export const GAME = {
  // --- Prestigio ---
  PRESTIGE: {
    INITIAL: 50,
    WIN_MATCH: 10,
    LOSE_MATCH: -10,
    WIN_LEAGUE: 15,
    RELEGATE: 0,
  },
  // --- Química (umbrales → bonus de media) ---
  CHEMISTRY: {
    THRESHOLDS: [0, 3, 6, 9, 12],  // bonus para química 0-19, 20-39, 40-59, 60-79, 80-100
    STEP: 20,                        // cada cuánto cambia el umbral
  },
  // --- Tiers (desbloqueo por prestigio) ---
  TIERS: [
    { tier: 1, min: 0,  max: 20, label: "Regional" },
    { tier: 2, min: 21, max: 40, label: "Ascenso" },
    { tier: 3, min: 41, max: 60, label: "Primera (bajo)" },
    { tier: 4, min: 61, max: 80, label: "Primera (medio)" },
    { tier: 5, min: 81, max: 100, label: "Primera (alto)" },
  ],
  // --- Temporada y ligas ---
  SEASON: {
    MATCHES: 3,
  },
  LEAGUE: {
    ascenso: {
      totalTeams: 20,
      zones: [
        { zone: 1, minWins: 2, label: "Promoción directa", min: 1, max: 3, outcome: "promoted" },
        { zone: 2, minWins: 1, label: "Playoff (reducido)", min: 4, max: 8, outcome: "playoff" },
        { zone: 3, minWins: 0, label: "Esperar al año que viene", min: 9, max: 20, outcome: "stay" },
      ],
    },
    primera: {
      totalTeams: 20,
      zones: [
        { zone: 1, minWins: 2, label: "Campeón + Libertadores", min: 1, max: 4, outcome: "champion" },
        { zone: 2, minWins: 1, label: "Media tabla", min: 5, max: 16, outcome: "stay" },
        { zone: 3, minWins: 0, label: "Descenso", min: 9, max: 20, outcome: "relegated" },
      ],
    },
  },
  // --- Partido ---
  MATCH: {
    MOMENTS: 8,
    MOMENTS_PER_HALF: 4,
    MATCH_EVENT_SLOTS: [2, 1, 2],  // 1T, entretiempo, 2T
  },
};
