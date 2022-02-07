import { useCallback, useEffect, useReducer } from "react";
import Board from "./Board";
import Keyboard from "./Keyboard";

import _validAnswers from "./validAnswers.json";
import _validGuesses from "./validGuesses.json";
import { CheckedWord, checkWord, getAllLetterResults } from "./wordCheck";

const validAnswers: { [index: number]: string[] | undefined } = _validAnswers;
const validGuesses: { [index: number]: string[] | undefined } = _validGuesses;

type GameStatus = "playing" | "won" | "lost";

export interface BoardState {
  gameStatus: GameStatus;
  answer: string;
  guessLimit: number;
  previousGuesses: CheckedWord[];
}

interface GameState {
  gameStatus: GameStatus;
  boards: BoardState[];
  currentGuess: string;
  error: string | null;
}

interface BoardSetup {
  answer: string;
  guessLimit: number;
}

interface GameSetup {
  boards: BoardSetup[];
}

type GameAction =
  | { type: "letter"; letter: string }
  | { type: "backspace" }
  | { type: "submit" }
  | { type: "restart"; setup: GameSetup };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "letter": {
      if (state.gameStatus !== "playing") {
        return state;
      }

      const newGuess = state.currentGuess + action.letter;
      return {
        ...state,
        // Don't let the guess grow longer than the longest answer
        currentGuess:
          newGuess.length <= Math.max(...state.boards.map((board) => board.answer.length))
            ? newGuess
            : state.currentGuess,
      };
    }

    case "backspace": {
      if (state.gameStatus !== "playing") {
        return state;
      }

      return {
        ...state,
        currentGuess: state.currentGuess.slice(0, -1),
      };
    }

    case "submit": {
      if (state.gameStatus !== "playing") {
        return state;
      }

      if (!state.boards.map((board) => board.answer.length).includes(state.currentGuess.length)) {
        return {
          ...state,
          error: "Too short",
        };
      }

      if (!validGuesses[state.currentGuess.length]?.includes(state.currentGuess)) {
        return {
          ...state,
          error: "Invalid guess",
        };
      }

      const newBoards = state.boards.map((board) => {
        if (board.gameStatus !== "playing") {
          return board;
        }

        const newBoard = { ...board };
        newBoard.previousGuesses = [...board.previousGuesses, checkWord(state.currentGuess, board.answer)];

        if (state.currentGuess === board.answer) {
          newBoard.gameStatus = "won";
        } else if (newBoard.previousGuesses.length >= newBoard.guessLimit) {
          newBoard.gameStatus = "lost";
        }

        return newBoard;
      });

      let newGameState: GameStatus = state.gameStatus;
      if (newBoards.every((board) => board.gameStatus === "won")) {
        newGameState = "won";
      } else if (newBoards.some((board) => board.gameStatus === "lost")) {
        newGameState = "lost";
      }
      return {
        ...state,
        gameStatus: newGameState,
        boards: newBoards,
        currentGuess: "",
        error: null,
      };
    }

    case "restart": {
      return initializeGame(action.setup);
    }
  }
}

function initializeGame(setup: GameSetup): GameState {
  return {
    gameStatus: "playing",
    boards: setup.boards.map((board) => ({
      answer: board.answer,
      guessLimit: board.guessLimit,
      gameStatus: "playing",
      previousGuesses: [],
    })),
    currentGuess: "",
    error: null,
  };
}

function generateAnswer(length: number): string {
  const answers = validAnswers[length];
  if (answers) {
    return answers[Math.floor(Math.random() * answers.length)];
  } else {
    throw new Error(`No answers of length ${length} were found`);
  }
}

function generateGameSetup(): GameSetup {
  return {
    boards: [
      { answer: generateAnswer(5), guessLimit: 6 },
      { answer: generateAnswer(5), guessLimit: 6 },
    ],
  };
}

interface GameProps {
  guessLimit: number;
  wordLength: number;
}

function Game(props: GameProps) {
  const [state, dispatch] = useReducer(gameReducer, generateGameSetup(), initializeGame);

  // We don't want to be removing/adding the keyboard listener every render, that could cause dropped inputs
  // So store the onKey handler as a callback, then we only have to re-run the effect when the game status changes.
  const onKey = useCallback(
    (key: string) => {
      if (key === "Enter") {
        if (state.gameStatus === "playing") {
          dispatch({ type: "submit" });
        } else {
          dispatch({ type: "restart", setup: generateGameSetup() });
        }
      } else if (key === "Backspace") {
        dispatch({ type: "backspace" });
      } else if (/^[a-zA-Z]$/.test(key)) {
        dispatch({ type: "letter", letter: key });
      }
    },
    [state.gameStatus]
  );

  useEffect(() => {
    const keyDownListener = (event: KeyboardEvent) => {
      const key = event.key;
      onKey(key);
    };

    document.addEventListener("keydown", keyDownListener);

    return () => {
      document.removeEventListener("keydown", keyDownListener);
    };
  }, [onKey]);

  let message;
  if (state.error) {
    message = state.error;
  } else if (state.gameStatus === "won") {
    message = "Congratulations, you won! Enter to play again.";
  } else if (state.gameStatus === "lost") {
    message = "Sorry, you lost. Enter to play again.";
  }

  return (
    <>
      <div className="boards">
        {state.boards.map((board, index) => (
          <Board key={index} board={board} currentGuess={state.currentGuess} />
        ))}
      </div>
      <p>{message}</p>
      <Keyboard onKey={onKey} letterInfo={state.boards.map((board) => getAllLetterResults(board.previousGuesses))} />
    </>
  );
}

export default Game;
