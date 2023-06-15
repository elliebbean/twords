import TextButton from "components/TextButton";
import { useState } from "react";
import { GameState } from "services/game";

interface ShareButtonProps {
  game: GameState;
  newHighScore?: boolean;
}

function ShareButton({ game, newHighScore }: ShareButtonProps) {
  const [disabled, setDisabled] = useState(false);
  const share = () => {
    const text =
      `I scored ${game.score} in today's two|rds!\n` +
      (newHighScore ? `That's a new high score!\n` : "") +
      window.location.href;

    navigator.clipboard.writeText(text);
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 2000);
  };

  return disabled ? (
    <>Copied to clipboard!</>
  ) : (
    <TextButton
      onClick={() => {
        share();
      }}
    >
      share
    </TextButton>
  );
}

export default ShareButton;
