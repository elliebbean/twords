import { useState, useEffect } from "react";
import Board from "./Board";
import Keyboard from "./Keyboard";

import validAnswers from "./validAnswers.json";
import validGuesses from "./validGuesses.json";
import { checkAllLettersMultipleAnswers, checkWord } from "./wordCheck";

interface GameProps {
    guessLimit: number;
    wordLength: number;
}

interface Answer {
    word: string;
    solvedAt: number | null;
}

function generateAnswer(): Answer {
    return {
        word: validAnswers[Math.floor(Math.random() * validAnswers.length)],
        solvedAt: null
    };
}

function Game(props: GameProps) {

    const [answers, setAnswers] = useState<Answer[]>([generateAnswer(), generateAnswer()]);
    const [currentGuess, setCurrentGuess] = useState("");
    const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [inProgress, setInProgress] = useState(true);

    const startNewGame = () => {
        setAnswers([generateAnswer(), generateAnswer()]);
        setCurrentGuess("");
        setPreviousGuesses([]);
        setMessage("");
        setInProgress(true);
    }

    const onKey = (key: string) => {
        if (!inProgress) {
            if(key === "Enter") {
                startNewGame();
            }

            return;
        }

        if (/^[a-zA-Z]$/.test(key)) {
            if (currentGuess.length < props.wordLength) {
                setCurrentGuess(guess => guess + key.toLowerCase());
            }
        }
        else if (key === "Enter") {

            if (currentGuess.length !== props.wordLength) {
                setMessage("That guess is too short");
                return;
            }

            if (!validGuesses.includes(currentGuess)) {
                setMessage(`${currentGuess.toUpperCase()} isn't a valid word`);
                return;
            }

            setPreviousGuesses(guesses => [...guesses, currentGuess]);
            setCurrentGuess("");

            const newAnswers = answers.map(answer => {
                if (currentGuess === answer.word) {
                    return { ...answer, solvedAt: previousGuesses.length };
                }
                else {
                    return answer;
                }
            });

            if (newAnswers.every(answer => answer.solvedAt !== null)) {
                setMessage(`Congratulations, you got ${answers.map(answer => answer.word.toUpperCase()).join(" and ")} in ${previousGuesses.length + 1} guesses. Press enter to play again`);
                setInProgress(false);
            }
            else if (previousGuesses.length + 1 >= props.guessLimit) {
                setMessage(`Sorry, you didn't guess ${answers.map(answer => answer.word.toUpperCase()).join(" and ")}`);
                setInProgress(false);
            }

            setAnswers(newAnswers);

        }
        else if (key === "Backspace") {
            if (currentGuess.length > 0) {
                setCurrentGuess(guess => guess.slice(0, -1));
            }
        }
    }

    useEffect(() => {
        const keyDownListener = (event: KeyboardEvent) => {
            const key = event.key;
            onKey(key);
        }

        document.addEventListener("keydown", keyDownListener);

        return () => {
            document.removeEventListener("keydown", keyDownListener);
        }
    });

    return (
        <>

            <div className="boards">
                {answers.map((answer, index) =>
                    <Board key={index}
                        answerLength={answer.word.length}
                        guessLimit={6}
                        previousGuesses={(answer.solvedAt === null ? previousGuesses : previousGuesses.slice(0, answer.solvedAt + 1)).map((guess => checkWord(guess, answer.word)))}
                        currentGuess={answer.solvedAt === null ? checkWord(currentGuess, answer.word) : []}
                    />
                )}
            </div>
            <p>{message}</p>
            <Keyboard onKey={onKey} letterInfo={checkAllLettersMultipleAnswers(previousGuesses, answers.map(answer => answer.word))} />
        </>
    )
}

export default Game;