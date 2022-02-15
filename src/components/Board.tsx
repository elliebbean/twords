import Line from "components/Line";
import { BoardState } from "services/game";

interface BoardProps {
  board: BoardState;
  currentGuess: string;
}

function Board({ board: { answer, status: gameStatus, guessLimit, previousGuesses }, currentGuess }: BoardProps) {
  const lines = previousGuesses.map((guess, i) => <Line key={i} guess={guess} length={answer.length} showResults />);

  if (gameStatus === "playing") {
    lines.push(<Line key={lines.length} guess={currentGuess} length={answer.length} />);
  }

  if (gameStatus !== "won") {
    for (let i = lines.length; i < guessLimit; i++) {
      lines.push(<Line key={i} guess={[]} length={answer.length} />);
    }
  }

  if (gameStatus === "lost") {
    lines.push(<Line key={lines.length} guess={answer} length={answer.length} failure />);
  }

  return <div className="board">{lines}</div>;
}

export default Board;
