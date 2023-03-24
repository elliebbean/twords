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

const BoardWrapper = styled.div`
  flex: 1 0;
  max-width: 22rem;

  @media (max-width: 500px), (max-height: 850px) {
    max-width: 14rem;
  }
`;

function Game(props: GameProps) {
  const [selectedBoard, setSelectedBoard] = useState<"left" | "right" | undefined>();
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
        {(["left", "right"] as const).map((side, index) => (
          <BoardWrapper
            onPointerEnter={(event) => event.pointerType === "mouse" && setSelectedBoard(side)}
            onPointerLeave={(event) => event.pointerType === "mouse" && setSelectedBoard(undefined)}
            onPointerDown={(event) => event.pointerType !== "mouse" && setSelectedBoard(side)}
            onPointerUp={(event) => event.pointerType !== "mouse" && setSelectedBoard(undefined)}
          >
            <Board
              board={state.boards[index]}
              currentGuess={state.currentGuess}
              selected={selectedBoard === undefined ? undefined : selectedBoard === side}
              key={side}
            />
          </BoardWrapper>
        ))}
      </Boards>
      <p>{message}</p>
      <StatusBar game={state} />
      <Keyboard
        fill={selectedBoard}
        onKey={onKey}
        letterInfo={state.boards.map((board) => getAllLetterResults(board.previousGuesses))}
      />
    </GameDiv>
  );
}

export default Game;
