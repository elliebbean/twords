import Line from "components/Line";
import { BoardState, GameStatus } from "services/game";
import styled from "styled-components";

interface BoardProps {
  board: BoardState;
  currentGuess: string;
  selected?: boolean;
  gameStatus?: GameStatus;
}

const BoardDiv = styled.div<{ selected?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: box-shadow 0.5s ease, opacity 0.5s ease;
  box-shadow: 0 0 ${({ selected }) => (selected ? "10px" : "")} rgba(255, 255, 255, 0.5);
  opacity: ${({ selected }) => (selected !== undefined && !selected ? "0.7" : "1")};
`;

function Board({ board, currentGuess, selected, gameStatus }: BoardProps) {
  const { answer, status: boardStatus, guessLimit, previousGuesses } = board;
  const lines = previousGuesses.map((guess, i) => <Line key={i} guess={guess} length={answer.length} showResults />);

  const status = gameStatus ?? boardStatus;

  if (status === "playing") {
    lines.push(<Line key={lines.length} guess={currentGuess} length={answer.length} />);
  }

  for (let i = lines.length; i < guessLimit; i++) {
    lines.push(<Line key={i} guess={[]} length={answer.length} />);
  }

  if (status === "lost") {
    lines.push(<Line key={lines.length} guess={answer} length={answer.length} failure />);
  }

  return <BoardDiv selected={selected}>{lines}</BoardDiv>;
}

export default Board;
