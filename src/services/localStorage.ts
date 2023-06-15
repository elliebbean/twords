import { GameMode, GameState } from "./game";

const gameStatePrefix = "game-";
const version = 0;

export function loadGame(gameMode: GameMode): GameState | undefined {
  const gameStateJson = localStorage.getItem(gameStatePrefix + gameMode);

  if (!gameStateJson) {
    return;
  }

  const gameState = JSON.parse(gameStateJson);

  // at some point we should implement migration or something but it's fine for now to just ignore the old save
  if ("_version" in gameState && gameState._version === version) {
    return gameState as GameState;
  } else {
    return;
  }
}

export function saveGame(gameState: GameState) {
  const stateToSave = { ...gameState, _version: version };
  localStorage.setItem(gameStatePrefix + gameState.settings.mode, JSON.stringify(stateToSave));
}
