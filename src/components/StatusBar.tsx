import { GameState, seedToDate } from "services/game";

interface StatusBarProps {
  game: GameState;
}
function StatusBar({ game }: StatusBarProps) {
  let seedDescription;
  let link;

  if (game.mode === "daily") {
    seedDescription = seedToDate(game.seed).toLocaleDateString();
    link = <a href="/?random">play a random game</a>;
  } else {
    seedDescription = "#" + game.seed.toString(36);
    link = <a href="/">play daily game</a>;
  }
  return (
    <div className="statusbar">
      <p>
        {game.mode} {seedDescription}
      </p>
      <p>{link}</p>
    </div>
  );
}

export default StatusBar;
