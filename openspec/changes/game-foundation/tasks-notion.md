# 🎮 el-mister — Plan de implementación

> **Stack:** JavaScript · React 19 · Vite · Tailwind CSS 4 · API-Football · Vitest
> **Arquitectura:** Clean Architecture adaptada a JS (core → application → ui ← infrastructure)
> **Estrategia:** 5 PRs stacked-to-main · ~2,100 líneas totales

---

## 📦 Work Units

| PR | Fase | ¿Qué hace? | Archivos | ~Líneas |
|---|---|---|---|---|
| 1 | Foundation | RNG, constantes, DT, química, catálogos | 8 | 370 |
| 2 | Core Engines | Match engine, liga, fichajes | 6 | 360 |
| 3 | Infra + App | localStorage, API-Football, casos de uso | 8 | 400 |
| 4 | UI | Provider, hooks, 6 pantallas, 6 componentes | 16 | 850 |
| 5 | Integration | Smoke test, verificación de requisitos | 2 | 120 |

---

## PR 1: Foundation — Datos y entidad DT

<details>
<summary>▶ 1.1 Instalar dependencias de testing</summary>

- [ ] `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
- [ ] Agregar `"test": "vitest"` a `package.json`

</details>

<details>
<summary>▶ 1.2 Generador de números aleatorios (RNG)</summary>

- [ ] `src/core/rng.js` — `mulberry32(seed)` → función que devuelve floats 0-1
- [ ] `src/core/rng.test.js` — mismo seed = misma secuencia

</details>

<details>
<summary>▶ 1.3 Constantes del juego</summary>

- [ ] `src/data/constants.js` — umbrales de 5 tiers, deltas de prestigio, bonus de química, configuración de temporada, mapeo tier→división

</details>

<details>
<summary>▶ 1.4 Entidad DT</summary>

- [ ] `src/core/dt.js` — factory `(name) → { name, prestige: 50, chemistry: 0 }`
- [ ] Funciones: `gainPrestige()`, `losePrestige()`, `getTier()`, `isFired()` (≤10%), `isGameOver()`
- [ ] `src/core/dt.test.js`

</details>

<details>
<summary>▶ 1.5 Sistema de química</summary>

- [ ] `src/core/chemistry.js` — lookup de bonus por umbral: 0→+0, 20→+3, 40→+6, 60→+9, 80→+12
- [ ] `src/core/chemistry.test.js`

</details>

<details>
<summary>▶ 1.6 Catálogos de datos</summary>

- [ ] `src/data/events.js` — 15+ eventos de partido, 10+ eventos de dashboard (cada uno: descripción, opciones, efectos, probabilidad)
- [ ] `src/data/players.js` — pool de 30+ jugadores (rating, modificador de química, evento que desbloquea)

</details>

---

## PR 2: Core Engines — Match, Liga, Fichajes

<details>
<summary>▶ 2.1 Motor de liga</summary>

- [ ] `src/core/league.js` — ordenar tabla (pts → GD → GF), reglas de ascenso/descenso, generar 3 rivales por temporada
- [ ] `src/core/league.test.js`

</details>

<details>
<summary>▶ 2.2 Motor de partido</summary>

- [ ] `src/core/match.js` — `simulateMatch()` con 8 momentos (4+4)
- [ ] Cálculo de probabilidad de gol (media local + visitante + bonus de química)
- [ ] Penales para empates en mata-mata (5 rondas + muerte súbita)
- [ ] `src/core/match.test.js`

</details>

<details>
<summary>▶ 2.3 Sistema de fichajes</summary>

- [ ] `src/core/signing.js` — generar pool de jugadores, calcular impacto en química, lógica fichar/saltar, persistencia de plantel
- [ ] `src/core/signing.test.js`

</details>

---

## PR 3: Infraestructura + Casos de uso

<details>
<summary>▶ 3.1 Adaptador de persistencia</summary>

- [ ] `src/infrastructure/storage.js` — `get/set/remove` con manejo de errores, namespacing de slots (`el-mister:slot:1`)
- [ ] `src/infrastructure/storage.test.js`

</details>

<details>
<summary>▶ 3.2 Adaptador API-Football</summary>

- [ ] `src/infrastructure/apiFootball.js` — fetch de equipos de Primera Nacional (league ID 130) desde RapidAPI
- [ ] Transformar respuesta a `{ id, name, logo, rating }`
- [ ] Caché en memoria (fetch una vez por sesión), fallback `[]` si falla
- [ ] `src/infrastructure/apiFootball.test.js`

</details>

<details>
<summary>▶ 4.1 Save y Load</summary>

- [ ] `src/application/saveGame.js` — serializar estado a JSON con campo `version`
- [ ] `src/application/loadGame.js` — validar integridad, rechazar corruptos, pipeline de migración
- [ ] Tests

</details>

<details>
<summary>▶ 4.2 Caso de uso: jugar partido</summary>

- [ ] `src/application/playMatch.js` — inyectar RNG → match engine, mapear momentos a acciones UI, inyectar eventos 2+1+2
- [ ] `src/application/playMatch.test.js`

</details>

<details>
<summary>▶ 4.3 Caso de uso: jugar temporada</summary>

- [ ] `src/application/playSeason.js` — orquestar 3 partidos, calcular tabla, aplicar ascenso/descenso, disparar fase de fichajes
- [ ] `src/application/playSeason.test.js`

</details>

<details>
<summary>▶ 4.4 Casos de uso: fichajes y cambio de club</summary>

- [ ] `src/application/signPlayers.js` — aceptar/saltar con impacto en química
- [ ] `src/application/changeClub.js` — despido → bajar tier → ofertas, subir tier → ofertas, reset de química al cambiar club
- [ ] Tests

</details>

---

## PR 4: UI — Provider, Hooks, Pantallas, Componentes

<details>
<summary>▶ 5.1 Provider y estado global</summary>

- [ ] `src/ui/GameProvider.jsx` — React Context + useReducer para estado del juego
- [ ] `src/ui/hooks/useGameState.js` — hook para dispatch con RNG/storage/clubRepo inyectados
- [ ] Test

</details>

<details>
<summary>▶ 5.2 Hooks de UI</summary>

- [ ] `src/ui/hooks/useMatch.js` — puente entre playMatch y React
- [ ] `src/ui/hooks/useLoadSave.js` — puente entre save/load y React

</details>

<details>
<summary>▶ 5.3 Pantallas: Inicio, Club, Dashboard</summary>

- [ ] `Inicio.jsx` — input de nombre del DT
- [ ] `ClubSelect.jsx` — lista de clubes filtrada por tier (desde API-Football)
- [ ] `Dashboard.jsx` — stats de temporada, botón jugar, eventos de dashboard
- [ ] Tests

</details>

<details>
<summary>▶ 5.4 Pantallas: Partido, Cambio equipo, Resumen, Resultado</summary>

- [ ] `Partido.jsx` — secuencia de 8 momentos + overlay de EventModal
- [ ] `CambioEquipo.jsx` — tarjetas de ofertas de clubes
- [ ] `Resumen.jsx` — tabla post-temporada
- [ ] `ResultadoFinal.jsx` — resumen de carrera + game over

</details>

<details>
<summary>▶ 5.5 Componentes reutilizables</summary>

- [ ] `MomentCard.jsx` — un momento del partido
- [ ] `Scoreboard.jsx` — marcador
- [ ] `PrestigeBar.jsx` — barra de prestigio
- [ ] `ChemistryBar.jsx` — barra de química
- [ ] `StandingTable.jsx` — tabla de posiciones
- [ ] `EventModal.jsx` — ventana flotante para eventos

</details>

<details>
<summary>▶ 5.6 Wiring final</summary>

- [ ] Modificar `src/main.jsx` — envolver App en GameProvider, rutear pantallas por campo `state` (sin React Router)

</details>

---

## PR 5: Integración y verificación

<details>
<summary>▶ 6.1 Smoke test completo</summary>

- [ ] Crear DT → elegir club → jugar temporada completa (3 partidos) → fichajes → save/load → game over
- [ ] `npm run build && npm run preview` — verificar que compila y corre

</details>

<details>
<summary>▶ 6.2 Trazabilidad de requisitos</summary>

- [ ] Verificar que los 51 requisitos de las 7 specs tienen al menos un test que los cubre

</details>

---

## ✅ Checklist de verificación final

- [ ] `npm test` — todos los tests pasan
- [ ] `npm run build` — compila sin errores
- [ ] `npm run dev` — juego completo: inicio → fin → game over
- [ ] Save/load funciona tras refresh de página
- [ ] Los 3 slots de save son independientes
- [ ] API-Football responde con datos reales (o fallback gracefully)
- [ ] Despido (prestigio ≤ 10%) y game over se disparan correctamente
- [ ] Química por umbrales afecta resultados de partidos
