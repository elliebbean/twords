import Line from "./Line";
import { CheckedLetter } from "./wordCheck";

interface BoardProps {
    answer: string;
    guessLimit: number;
    previousGuesses: CheckedLetter[][];
    currentGuess: CheckedLetter[];
}

function Board(props: BoardProps) {
    const lines = [...Array(props.guessLimit)].map((_, i) => {
        if (i < props.previousGuesses.length) {
            return <Line key={i} guess={props.previousGuesses[i]} length={props.answer.length} showResults={true} />;
        }
        else if (i === props.previousGuesses.length) {
            return <Line key={i} guess={props.currentGuess} length={props.answer.length} showResults={false} />;
        }
        else {
            return <Line key={i} guess={[]} length={props.answer.length} showResults={false} />;
        }
    });

    return (
        <div className="board">
                {lines}
        </div>
    );
}

export default Board;