import { CheckedLetter } from "./wordCheck";

interface LineProps {
    guess: CheckedLetter[];
    length: number;
    showResults: boolean;
}

function Line(props: LineProps) {

    const { guess, length, showResults } = props;

    const letters = [...Array(length)].map((_, i) => {

        let className = "letter";
        let guessLetter = "";

        if (i < guess.length) {
            guessLetter = guess[i].letter

            if (showResults) {
                className += " " + guess[i].result;
            }
        }

        return <div className={className} key={i}>{guessLetter}</div>;
    });

    return (
        <div className="line">{letters}</div>
    );
}

export default Line;