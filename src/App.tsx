import "App.css";
import Game from "components/game/Game";
import Header from "components/header/Header";
import { GameMode } from "services/game";

function App() {
  const searchParams = new URLSearchParams(window.location.search);
  let gameMode: GameMode = "daily";
  if (searchParams.has("random")) {
    gameMode = "random";
  }

  return (
    <div className="app">
      <div className="center">
        <Header />
        <Game mode={gameMode} />
      </div>
    </div>
  );
}

export default App;
