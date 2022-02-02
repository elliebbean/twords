import Line from "./Line";
import { CheckedLetter } from "./wordCheck";

interface BoardProps {
    answerLength: number;
    guessLimit: number;
    previousGuesses: CheckedLetter[][];
    currentGuess: CheckedLetter[];
}

function Board({ answerLength, guessLimit, previousGuesses, currentGuess }: BoardProps) {
    const lines = [...Array(guessLimit)].map((_, i) => {
        if (i < previousGuesses.length) {
            return <Line key={i} guess={previousGuesses[i]} length={answerLength} showResults={true} />;
        }
        else if (i === previousGuesses.length) {
            return <Line key={i} guess={currentGuess} length={answerLength} showResults={false} />;
        }
        else {
            return <Line key={i} guess={[]} length={answerLength} showResults={false} />;
        }
    });

    return (
        <div className="board">
            {lines}
        </div>
    );
}

export default Board;