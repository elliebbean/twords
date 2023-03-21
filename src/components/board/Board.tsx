import Line from "components/line/Line";
import { BoardState } from "services/game";
import "./Board.css";

interface BoardProps {
  board: BoardState;
  currentGuess: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

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
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className="board">
      {lines}
    </div>
  );
}

export default Board;
