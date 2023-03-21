import Line from "components/Line";
import { BoardState } from "services/game";
import styled from "styled-components";

interface BoardProps {
  board: BoardState;
  currentGuess: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const BoardDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 0;
  max-width: 22rem;
  transition: box-shadow 0.5s ease;

  @media (max-width: 500px), (max-height: 850px) {
    max-width: 14rem;
  }

  :hover {
    box-shadow: 0 0 10px white;
  }
`;

function Board({ board, currentGuess, onMouseEnter, onMouseLeave }: BoardProps) {
  const { answer, status: gameStatus, guessLimit, previousGuesses } = board;
  const lines = previousGuesses.map((guess, i) => <Line key={i} guess={guess} length={answer.length} showResults />);

  if (gameStatus === "playing") {
    lines.push(<Line key={lines.length} guess={currentGuess} length={answer.length} />);
  }

  for (let i = lines.length; i < guessLimit; i++) {
    lines.push(<Line key={i} guess={[]} length={answer.length} />);
  }

  if (gameStatus === "lost") {
    lines.push(<Line key={lines.length} guess={answer} length={answer.length} failure />);
  }

  return (
    <BoardDiv onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {lines}
    </BoardDiv>
  );
}

export default Board;
