import { useCallback, useEffect, useReducer } from "react";
import Board from "components/Board";
import Keyboard from "components/Keyboard";

import { getAllLetterResults } from "services/wordCheck";
import { gameReducer, createGame, GameMode, generateGameSettings } from "services/game";

interface GameProps {
  mode: GameMode;
}

function Game(props: GameProps) {
  const [state, dispatch] = useReducer(gameReducer, generateGameSettings(props.mode), createGame);

  // We don't want to be removing/adding the keyboard listener every render, that could cause dropped inputs
  // So store the onKey handler as a callback, then we only have to re-run the effect when the game status changes.
  const onKey = useCallback(
    (key: string) => {
      if (key === "Enter") {
        if (state.status === "playing") {
          dispatch({ type: "submit" });
        } else {
          dispatch({ type: "restart", settings: generateGameSettings(props.mode) });
        }
      } else if (key === "Backspace") {
        dispatch({ type: "backspace" });
      } else if (/^[a-zA-Z]$/.test(key)) {
        dispatch({ type: "letter", letter: key });
      }
    },
    [state.status, props.mode]
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
  } else if (state.status === "won") {
    message = "Congratulations, you won! Enter to play again.";
  } else if (state.status === "lost") {
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