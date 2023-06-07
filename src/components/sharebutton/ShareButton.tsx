import { useState } from "react";
import { GameState } from "services/game";
import "./ShareButton.css";

interface ShareButtonProps {
  game: GameState;
}

function ShareButton({ game }: ShareButtonProps) {
  const [disabled, setDisabled] = useState(false);
  const share = () => {
    const text = `I scored ${game.score} in today's two|rds!\n` + window.location.href;

    navigator.clipboard.writeText(text);
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 2000);
  };

  return disabled ? (
    <>Copied to clipboard!</>
  ) : (
    <button
      className="share"
      onClick={(e) => {
        e.preventDefault();
        share();
      }}
    >
      share
    </button>
  );
}

export default ShareButton;
