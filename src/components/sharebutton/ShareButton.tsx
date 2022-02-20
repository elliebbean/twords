import { describeGameWithEmoji, GameState } from "services/game";
import "./ShareButton.css";

interface ShareButtonProps {
  game: GameState;
}

function ShareButton({ game }: ShareButtonProps) {
  const share = () => {
    navigator.clipboard.writeText(describeGameWithEmoji(game));
  };

  return game.status !== "playing" ? (
    <button
      className="share"
      onClick={(e) => {
        e.preventDefault();
        share();
      }}
    >
      share results to clipboard
    </button>
  ) : (
    <></>
  );
}

export default ShareButton;
