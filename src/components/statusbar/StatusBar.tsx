import ShareButton from "components/sharebutton/ShareButton";
import { describeSeed, GameState } from "services/game";
import "./StatusBar.css";

interface StatusBarProps {
  game: GameState;
}

function StatusBar({ game }: StatusBarProps) {
  let link;

  if (game.mode === "daily") {
    link = <a href="/?random">play a random game</a>;
  } else {
    link = <a href="/">play daily game</a>;
  }
  return (
    <div className="statusbar">
      <p>
        {game.mode} {describeSeed(game.seed, game.mode)}
      </p>
      <ShareButton game={game} />
      <p>{link}</p>
    </div>
  );
}

export default StatusBar;
