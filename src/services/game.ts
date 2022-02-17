import _validAnswers from "assets/answers.json";
import _validWords from "assets/words.json";
import Random from "services/random";
import { CheckedWord, checkWord } from "services/wordCheck";

export type GameMode = "daily" | "random";

export type GameStatus = "playing" | "won" | "lost";

export interface GameSettings {
  mode: GameMode;
  seed: number;
}

export interface BoardState {
  status: GameStatus;
  answer: string;
  guessLimit: number;
  previousGuesses: CheckedWord[];
}

export interface GameState {
  mode: GameMode;
  seed: number;
  status: GameStatus;
  boards: BoardState[];
  currentGuess: string;
  error: string | null;
}

export type GameAction =
  | { type: "letter"; letter: string }
  | { type: "backspace" }
  | { type: "submit" }
  | { type: "restart"; settings: GameSettings };

const validWords: { [index: number]: string[] | undefined } = _validWords;
const validAnswers: { [index: number]: string[] | undefined } = _validAnswers;

// Seperate seeds for daily/random games so you can't reproduce a daily game just by entering a specific seed
// (that's unlikely to ever matter, but we need to fill the second part of the seed with something anyway)
const dailySeed = 0xda7e;
const randomSeed = 0x5eed;

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "letter": {
      if (state.status !== "playing") {
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
      if (state.status !== "playing") {
        return state;
      }

      return {
        ...state,
        currentGuess: state.currentGuess.slice(0, -1),
      };
    }

    case "submit": {
      if (state.status !== "playing") {
        return state;
      }

      if (!state.boards.map((board) => board.answer.length).includes(state.currentGuess.length)) {
        return {
          ...state,
          error: "Too short",
        };
      }

      if (!validWords[state.currentGuess.length]?.includes(state.currentGuess)) {
        return {
          ...state,
          error: "Invalid guess",
        };
      }

      const newBoards = state.boards.map((board) => {
        if (board.status !== "playing") {
          return board;
        }

        const newBoard = { ...board };
        newBoard.previousGuesses = [...board.previousGuesses, checkWord(state.currentGuess, board.answer)];

        if (state.currentGuess === board.answer) {
          newBoard.status = "won";
        } else if (newBoard.previousGuesses.length >= newBoard.guessLimit) {
          newBoard.status = "lost";
        }

        return newBoard;
      });

      let newGameState: GameStatus = state.status;
      if (newBoards.every((board) => board.status === "won")) {
        newGameState = "won";
      } else if (newBoards.some((board) => board.status === "lost")) {
        newGameState = "lost";
      }
      return {
        ...state,
        status: newGameState,
        boards: newBoards,
        currentGuess: "",
        error: null,
      };
    }

    case "restart": {
      return createGame(action.settings);
    }
  }
}

// How likely we are to pick a word of different lengths
const wordLengthProbabilities: { [index: number]: number | undefined } = {
  4: 0.5,
  5: 1.5,
  6: 1,
  7: 0.5,
};

export function createGame(settings: GameSettings): GameState {
  const seedPrefix = settings.mode === "daily" ? dailySeed : randomSeed;
  const random = new Random(seedPrefix, settings.seed);

  const wordLengths = Object.keys(validAnswers).map((key) => parseInt(key));
  const wordLength = random.nextElementWeighted(wordLengths, (length) => wordLengthProbabilities[length] ?? 0);

  const answers = [random.nextElement(validAnswers[wordLength]!)];
  answers.push(random.nextElement(validAnswers[wordLength]!.filter((word) => !answers.includes(word))));

  return {
    ...settings,
    status: "playing",
    boards: answers.map((answer) => ({
      answer,
      guessLimit: 6,
      status: "playing",
      previousGuesses: [],
    })),
    currentGuess: "",
    error: null,
  };
}

export function generateGameSettings(mode: GameMode): GameSettings {
  const settings = { mode };
  switch (mode) {
    case "random":
      return { ...settings, seed: Random.randomSeed() };
    case "daily":
      return { ...settings, seed: Math.floor(Date.now() / (1000 * 60 * 60 * 24)) };
  }
}
