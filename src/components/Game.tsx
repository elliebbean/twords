import Board from "components/Board";
import Keyboard from "components/Keyboard";
import { useStoredState } from "hooks/storedState";
import { useCallback, useEffect, useReducer, useState } from "react";
import { GameMode, gameReducer, generateGameSettings, loadOrCreateGame } from "services/game";
import { saveGame } from "services/localStorage";
import { getAllLetterResults } from "services/wordCheck";
import styled from "styled-components";
import StatusBar from "./StatusBar";

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

  @media (max-width: 575px), (max-height: 850px) {
    max-width: 14rem;
  }
`;

function Game(props: GameProps) {
  const [hoveredBoard, setHoveredBoard] = useState<"left" | "right" | undefined>();
  const [clickedBoard, setClickedBoard] = useState<"left" | "right" | undefined>();
  const [state, dispatch] = useReducer(gameReducer, generateGameSettings(props.mode), loadOrCreateGame);
  const [error, setError] = useState<string | undefined>();
  const [highScore, setHighScore] = useStoredState<number>(`high-score-${props.mode}`, 0);

  const selectedBoard = clickedBoard ?? hoveredBoard;

  useEffect(() => {
    saveGame(state);

    if (state.score > highScore) {
      setHighScore(state.score);
    }
  }, [state, highScore, setHighScore]);

  // We don't want to be removing/adding the keyboard listener every render, that could cause dropped inputs
  // So store the onKey handler as a callback, then we only have to re-run the effect when the game status changes.
  const onKey = useCallback(
    (key: string) => {
      if (key === "Enter") {
        if (state.status === "playing") {
          dispatch({ type: "submit" });
        } else if (props.mode === "random") {
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

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(undefined), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (state.error) {
    setError(state.error);
    dispatch({ type: "clearError" });
  }

  return (
    <GameDiv>
      <Boards onPointerDown={() => setClickedBoard(undefined)}>
        {(["left", "right"] as const).map((side, index) => (
          <BoardWrapper
            onPointerEnter={(event) => event.pointerType === "mouse" && setHoveredBoard(side)}
            onPointerLeave={(event) => event.pointerType === "mouse" && setHoveredBoard(undefined)}
            onPointerDown={(event) => {
              console.log("onPointerDown");
              setClickedBoard(clickedBoard === side ? undefined : side);
              event.stopPropagation();
            }}
            key={side}
          >
            <Board
              board={state.boards[index]}
              currentGuess={state.currentGuess}
              selected={selectedBoard === undefined ? undefined : selectedBoard === side}
              key={side}
              gameStatus={state.status}
            />
          </BoardWrapper>
        ))}
      </Boards>
      {error && <p>{error}</p>}
      <StatusBar
        highScore={highScore}
        game={state}
        newGameAction={() => {
          dispatch({ type: "restart", settings: generateGameSettings(props.mode) });
        }}
      />
      <Keyboard
        fill={selectedBoard}
        onKey={onKey}
        letterInfo={state.boards.map((board) => getAllLetterResults(board.previousGuesses))}
      />
    </GameDiv>
  );
}

export default Game;
