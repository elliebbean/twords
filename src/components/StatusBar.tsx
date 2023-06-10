import ShareButton from "components/ShareButton";
import { ReactNode, useEffect, useState } from "react";
import { GameState, currentDailySeed, describeSeed, seedToDate } from "services/game";
import styled from "styled-components";
import TextButton from "./TextButton";

interface StatusBarProps {
  game: GameState;
  highScore: number;
  newGameAction: () => void;
}

const StatusBarDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-block: 0.25rem;

  @media (max-width: 575px) {
    flex-direction: column;
  }
`;

const StatusBarItem = styled.p`
  display: inline-block;
`;

const StatusBarItem2 = styled.p`
  display: inline-block;
  align-self: end;
`;

const currentTimeToNewGame = () => {
  return seedToDate(currentDailySeed() + 1).getTime() - new Date().getTime();
};

function StatusBar({ game, highScore, newGameAction }: StatusBarProps) {
  const [timeToNewGame, setTimeToNewGame] = useState(currentTimeToNewGame());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeToNewGame(currentTimeToNewGame());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [game.settings.seed]);

  let timeToNewGameMessage: ReactNode = "";

  if (timeToNewGame <= 0) {
    timeToNewGameMessage = <TextButton onClick={newGameAction}>new game available!</TextButton>;
  } else {
    if (game.status === "playing") {
      timeToNewGameMessage = "";
    } else {
      const dateToNewGame = new Date(timeToNewGame);
      if (dateToNewGame.getHours() === 0) {
        timeToNewGameMessage = `(new game in 24 hours)`;
      } else if (dateToNewGame.getHours() > 2) {
        timeToNewGameMessage = `(new game in ${dateToNewGame.getHours() - 1} hours)`;
      } else if (dateToNewGame.getHours() === 2) {
        timeToNewGameMessage = `(new game in 1 hour)`;
      } else if (dateToNewGame.getMinutes() === 0) {
        timeToNewGameMessage = `(new game in 60 minutes)`;
      } else if (dateToNewGame.getMinutes() > 2) {
        timeToNewGameMessage = `(new game in ${dateToNewGame.getMinutes() - 1} minutes)`;
      } else if (dateToNewGame.getMinutes() === 1) {
        timeToNewGameMessage = `(new game in 1 minute)`;
      }
    }
  }

  return (
    <StatusBarDiv>
      <StatusBarItem>
        {game.settings.mode !== "endless" ? game.settings.mode : ""} {describeSeed(game.settings)}
        {timeToNewGameMessage && " - "}
        {timeToNewGameMessage}
      </StatusBarItem>
      {game.settings.endless && (
        <StatusBarItem2>
          Score: {game.score} (Highest: {highScore})
          {game.status !== "playing" && (
            <>
              {" "}
              - <ShareButton game={game} />
            </>
          )}
        </StatusBarItem2>
      )}
    </StatusBarDiv>
  );
}

export default StatusBar;
