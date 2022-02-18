import "App.css";
import Game from "components/game/Game";
import { GameMode } from "services/game";

function App() {
  const searchParams = new URLSearchParams(window.location.search);
  let gameMode: GameMode = "daily";
  if (searchParams.has("random")) {
    gameMode = "random";
  }

  return (
    <div className="app">
      <h1>two|rds</h1>
      <Game mode={gameMode} />
    </div>
  );
}

export default App;
