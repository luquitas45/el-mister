import { createContext, useContext, useReducer } from "react";
const GameContext = createContext(null);
const initialState = {
  screen: "inicio",
  dt: null,
  club: null,
  season: null,
  currentMatch: null,
  matchIndex: 0,
};
function gameReducer(state, action) {
  switch (action.type) {
    case "SET_SCREEN":
      return { ...state, screen: action.screen };
    case "SET_DT":
      return { ...state, dt: action.dt };
    case "SET_CLUB":
      return { ...state, club: action.club };
    case "SET_SEASON":
      return { ...state, season: action.season };
    case "SET_MATCH":
      return { ...state, currentMatch: action.match, matchIndex: action.index };
    case "RESET":
      return { ...initialState, screen: "dashboard" };
    default:
      return state;
  }
}
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame debe usarse dentro de GameProvider");
  return ctx;
}
