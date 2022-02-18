import { GameMode, GameState } from "./game";

const gameStatePrefix = "game-";

export function loadGame(gameMode: GameMode): GameState | undefined {
  const gameStateJson = localStorage.getItem(gameStatePrefix + gameMode);

  if (!gameStateJson) {
    return;
  }

  return JSON.parse(gameStateJson) as GameState;
}

export function saveGame(gameState: GameState) {
  localStorage.setItem(gameStatePrefix + gameState.mode, JSON.stringify(gameState));
}
