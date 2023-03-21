import Board from "components/Board";
import Keyboard from "components/Keyboard";
import { useCallback, useEffect, useReducer, useState } from "react";
import { GameMode, gameReducer, generateGameSettings, loadOrCreateGame } from "services/game";
import { saveGame } from "services/localStorage";
import { getAllLetterResults } from "services/wordCheck";
import styled from "styled-components";
import StatusBar from "./statusbar/StatusBar";

interface GameProps {
  mode: GameMode;
}

const GameDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0;
  width: 100%;
  padding: 0.25rem;
`;

const Boards = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-evenly;
  flex: 1 1;
  gap: 1rem;
  margin: 0.4rem;
`;

function Game(props: GameProps) {
  const [fill, setFill] = useState<"left" | "right" | undefined>();
  const [state, dispatch] = useReducer(gameReducer, generateGameSettings(props.mode), loadOrCreateGame);

  useEffect(() => {
    saveGame(state);
  }, [state]);

  // We don't want to be removing/adding the keyboard listener every render, that could cause dropped inputs
  // So store the onKey handler as a callback, then we only have to re-run the effect when the game status changes.
  const onKey = useCallback(
    (key: string) => {
      if (key === "Enter") {
        if (state.status === "playing") {
          dispatch({ type: "submit" });
        } else if (props.mode !== "daily") {
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
    message = "Congratulations, you won!" + (props.mode === "daily" ? "" : " Press enter to play again.");
  } else if (state.status === "lost") {
    message = "Sorry, you lost." + (props.mode === "daily" ? "" : " Press enter to play again.");
  }

  return (
    <GameDiv>
      <Boards>
        <Board
          onMouseEnter={() => setFill("left")}
          onMouseLeave={() => setFill(undefined)}
          board={state.boards[0]}
          currentGuess={state.currentGuess}
        />
        <Board
          onMouseEnter={() => setFill("right")}
          onMouseLeave={() => setFill(undefined)}
          board={state.boards[1]}
          currentGuess={state.currentGuess}
        />
      </Boards>
      <p>{message}</p>
      <StatusBar game={state} />
      <Keyboard
        fill={fill}
        onKey={onKey}
        letterInfo={state.boards.map((board) => getAllLetterResults(board.previousGuesses))}
      />
    </GameDiv>
  );
}

export default Game;
