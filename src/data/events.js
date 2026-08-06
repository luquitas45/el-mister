export const MATCH_EVENTS = [
  {
    id: "match_1",
    probability: 0.25,
    description: "¿Arriesgar con un jugador tocado en el segundo tiempo?",
    type: "riesgo_vs_seguro",
    choices: [
      { text: "Sí, que entre", effects: { chemistry: -3 }, chance: { probability: 0.50, effects: { goalProb: 15 } } },
      { text: "No, cuidarlo", effects: {} },
    ],
  },
  {
    id: "match_2",
    probability: 0.20,
    description: "¿Probás una táctica nueva que estuviste ensayando?",
    type: "apuesta",
    choices: [
      { text: "Sí, probarla", chance: { probability: 0.50, effects: { goalProb: 12, chemistry: 5 } } },
      { text: "No, a lo seguro", effects: {} },
    ],
  },
  {
    id: "match_3",
    probability: 0.30,
    description: "El rival está frágil en defensa. ¿Presionar arriba o replegarse?",
    type: "dos_caminos",
    choices: [
      { text: "Presionar arriba", effects: { goalProb: 8 }, chance: { probability: 0.30, effects: { goalProb: -5 } } },
      { text: "Replegarse", effects: { goalProb: -5 }, chance: { probability: 0.30, effects: { chemistry: 2 } } },
    ],
  },
  {
    id: "match_4",
    probability: 0.15,
    description: "Un ojeador te ofrece datos del rival a cambio de exposición mediática.",
    type: "sacrificio",
    choices: [
      { text: "Aceptar", effects: { prestige: -3, goalProb: 10 } },
      { text: "Rechazar", effects: {} },
    ],
  },
  {
    id: "match_5",
    probability: 0.18,
    description: "Un juvenil de la cantera pide entrar unos minutos.",
    type: "oportunidad_unica",
    choices: [
      { text: "Dale, que entre", effects: { chemistry: 4 }, chance: { probability: 0.60, effects: { goalProb: 10 } } },
      { text: "Hoy no, pibe", effects: { chemistry: -2 } },
    ],
  },
];
// --- Eventos de dashboard (entre partidos) ---
export const DASHBOARD_EVENTS = [
  {
    id: "dash_1",
    probability: 0.25,
    description: "Un periodista critica tu alineación en vivo.",
    type: "dos_caminos",
    choices: [
      { text: "Responder con altura", effects: { prestige: 3 } },
      { text: "Ignorarlo", effects: { chemistry: 1 } },
    ],
  },
  {
    id: "dash_2",
    probability: 0.25,
    description: "Un sponsor ofrece plata a cambio de poner a su hijo en el banco.",
    type: "sacrificio",
    choices: [
      { text: "Aceptar", effects: { prestige: 8, chemistry: -5 } },
      { text: "Rechazar", effects: { chemistry: 3 } },
    ],
  },
];
// --- Eventos de fichaje (una vez por año, el jugador elige o salta) ---
export const SIGNING_EVENTS = [
  {
    id: "sig_1",
    description: "Un delantero quiere venir, pero pide ser titular siempre.",
    type: "riesgo_vs_seguro",
    choices: [
      { text: "Ficharlo", effects: { chemistry: 5, prestige: 2 } },
      { text: "No ficharlo", effects: {} },
    ],
  },
  {
    id: "sig_2",
    description: "Un mediocampista con fama de amuleto en finales.",
    type: "oportunidad_unica",
    condition: { type: "final_match" },
    choices: [
      { text: "Ficharlo", effects: { chemistry: 8 } },
      { text: "No ficharlo", effects: {} },
    ],
  },
];
