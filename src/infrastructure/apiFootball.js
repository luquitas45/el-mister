const LEAGUE_ID = 130; // Primera Nacional Argentina
let cache = null;
/**
 * Obtiene los equipos de Primera Nacional desde API-Football.
 * Usa caché en memoria: solo fetchea una vez por sesión.
 * @returns {Promise<Array<{id: string, name: string, logo: string, rating: number}>>}
 */
export async function fetchTeams() {
  if (cache) return cache;
  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/teams?league=${LEAGUE_ID}&season=2024`,
      {
        headers: {
          "x-apisports-key": import.meta.env.VITE_RAPIDAPI_KEY,
        },
      },
    );
    const json = await res.json();
    cache = json.response.map((t) => ({
      id: `team-${t.team.id}`,
      name: t.team.name,
      logo: t.team.logo,
      rating: t.team.id % 100 + 1, // placeholder: rating de 1-100 basado en ID
    }));
    return cache;
  } catch {
    return []; // si falla la API, devolvemos array vacío
  }
}
