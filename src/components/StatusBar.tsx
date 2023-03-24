import ShareButton from "components/sharebutton/ShareButton";
import { describeSeed, GameState } from "services/game";
import styled from "styled-components";

interface StatusBarProps {
  game: GameState;
}

const StatusBarDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin-block: 0.25rem;
`;

const StatusBarItem = styled.p`
  display: inline-block;
`;

const LinkList = styled.ul`
  display: inline;
  margin: 0;
`;

const LinkListItem = styled.li`
  display: inline;

  :not(:first-child)::before {
    content: " | ";
  }
`;

function StatusBar({ game }: StatusBarProps) {
  let links;
  const random = <a href="/?random">random</a>;
  const daily = <a href="/?daily">daily</a>;
  const endless = <a href="/?endless">endless</a>;

  switch (game.mode) {
    case "daily":
      links = [random, endless];
      break;
    case "endless":
      links = [random, daily];
      break;
    case "random":
      links = [daily, endless];
      break;
  }

  return (
    <StatusBarDiv>
      <StatusBarItem>
        {game.mode} {describeSeed(game.seed, game.mode)}
      </StatusBarItem>
      {game.mode === "endless" ? <StatusBarItem>Score: {game.score}</StatusBarItem> : <ShareButton game={game} />}
      <LinkList>
        {links.map((link) => (
          <LinkListItem>{link}</LinkListItem>
        ))}
      </LinkList>
    </StatusBarDiv>
  );
}

export default StatusBar;
