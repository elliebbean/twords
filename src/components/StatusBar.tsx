import ShareButton from "components/sharebutton/ShareButton";
import { describeSeed, GameState } from "services/game";
import styled from "styled-components";

interface StatusBarProps {
  game: GameState;
  highScore: number;
}

const StatusBarDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin-block: 0.25rem;
`;

const StatusBarItem = styled.p`
  display: inline-block;
`;

function StatusBar({ game, highScore }: StatusBarProps) {
  return (
    <StatusBarDiv>
      <StatusBarItem>
        {game.settings.mode !== "endless" ? game.settings.mode : ""} {describeSeed(game.settings)}
      </StatusBarItem>
      {game.settings.endless && (
        <StatusBarItem>
          Score: {game.score} (Highest: {highScore})
          {game.status !== "playing" && (
            <>
              {" "}
              - <ShareButton game={game} />
            </>
          )}
        </StatusBarItem>
      )}
    </StatusBarDiv>
  );
}

export default StatusBar;
