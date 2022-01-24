import { useEffect, useState } from "react";
import Line from "./Line";
import validGuesses from "./validGuesses.json";

type GameProps = {
    target: string;
    guessLimit: number;
}

function Game(props: GameProps) {
    const [currentGuess, setCurrentGuess] = useState<string>("");
    const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
    const [message, setMessage] = useState<string>("");
    const [inProgress, setInProgress] = useState<boolean>(true);

    useEffect(() => {
        const keyDownListener = (event: KeyboardEvent) => {
            const key = event.key;

            if (!inProgress) return;

            if (/^[a-zA-Z]$/.test(key)) {
                if (currentGuess.length < props.target.length) {
                    setCurrentGuess(guess => guess + key.toLowerCase());
                }
            }
            else if (key === "Enter") {

                if (currentGuess.length !== props.target.length) {
                    setMessage("That guess is too short");
                    return;
                }

                if(!validGuesses.includes(currentGuess)){
                    setMessage("That guess isn't a valid word");
                    return;
                }

                setPreviousGuesses(guesses => [...guesses, currentGuess]);
                setCurrentGuess("");

                if (currentGuess === props.target) {
                    const totalGuesses = previousGuesses.length + 1;
                    setMessage(`Correct! You guessed ${props.target.toUpperCase()} in ${totalGuesses} guess${totalGuesses > 1 ? "es" : ""}`);
                    setInProgress(false);
                }
                else if (previousGuesses.length + 1 >= props.guessLimit) {
                    setMessage(`Sorry, you failed to guess ${props.target.toUpperCase()}`);
                    setInProgress(false);
                }

            }
            else if (key === "Backspace") {
                if (currentGuess.length > 0) {
                    setCurrentGuess(guess => guess.slice(0, -1));
                }
            }
        }

        document.addEventListener("keydown", keyDownListener);

        return () => {
            document.removeEventListener("keydown", keyDownListener);
        }
    });

    const lines = [...Array(props.guessLimit)].map((_, i) => {
        if (i < previousGuesses.length) {
            return <Line key={i} guess={previousGuesses[i]} target={props.target} showResults={true} />;
        }
        else if (i === previousGuesses.length) {
            return <Line key={i} guess={currentGuess} target={props.target} showResults={false} />;
        }
        else {
            return <Line key={i} guess={""} target={props.target} showResults={false} />;
        }
    });

    return (
        <div className="Board">
            {lines}
            <p>{message}</p>
        </div>
    );
}

export default Game;