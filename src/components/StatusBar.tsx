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

// const LinkList = styled.ul`
//   display: inline;
//   margin: 0;
// `;

// const LinkListItem = styled.li`
//   display: inline;

//   :not(:first-child)::before {
//     content: " | ";
//   }
// `;

function StatusBar({ game, highScore }: StatusBarProps) {
  //const links: GameMode[] = (["daily", "random", "endless"] as const).filter((mode) => mode !== game.mode);

  return (
    <StatusBarDiv>
      <StatusBarItem>
        {game.mode} {describeSeed(game.seed, game.mode)}
      </StatusBarItem>
      {game.mode === "endless" ? (
        <StatusBarItem>
          Score: {game.score} (Highest: {highScore})
        </StatusBarItem>
      ) : (
        <ShareButton game={game} />
      )}
      {/*<LinkList>
        {links.map((link) => (
          <LinkListItem key={link}>
            <a href={`/?${link}`}>{link}</a>
          </LinkListItem>
        ))}
        </LinkList>*/}
    </StatusBarDiv>
  );
}

export default StatusBar;
