import _validAnswers from "assets/answers.json";
import _validWords from "assets/words.json";
import Random from "services/random";
import { CheckedWord, checkWord, LetterResult } from "services/wordCheck";
import { loadGame } from "./localStorage";

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
  freeGuesses: number;
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
  5: 1.25,
  6: 1,
};

export function createGame(settings: GameSettings): GameState {
  const seedPrefix = settings.mode === "daily" ? dailySeed : randomSeed;
  const random = new Random(seedPrefix, settings.seed);

  const wordLengths = Object.keys(validAnswers).map((key) => parseInt(key));
  const wordLength = random.nextElementWeighted(wordLengths, (length) => wordLengthProbabilities[length] ?? 0);

  const answers = [random.nextElement(validAnswers[wordLength]!)];
  answers.push(random.nextElement(validAnswers[wordLength]!.filter((word) => !answers.includes(word))));

  const freeGuess = random.nextElement(validAnswers[wordLength]!.filter((word) => !answers.includes(word)));

  return {
    ...settings,
    status: "playing",
    boards: answers.map((answer) => ({
      answer,
      guessLimit: 7,
      freeGuesses: 1,
      status: "playing",
      previousGuesses: [checkWord(freeGuess, answer)],
    })),
    currentGuess: "",
    error: null,
  };
}

export function loadOrCreateGame(settings: GameSettings): GameState {
  const savedGame = loadGame(settings.mode);

  if (!savedGame) {
    return createGame(settings);
  } else if (settings.mode === "daily" && savedGame.seed === settings.seed) {
    return savedGame;
  } else if (settings.mode === "random" && savedGame.status === "playing") {
    return savedGame;
  } else {
    return createGame(settings);
  }
}

export function generateGameSettings(mode: GameMode): GameSettings {
  const settings = { mode };
  switch (mode) {
    case "random":
      return { ...settings, seed: Random.randomSeed() };
    case "daily":
      return { ...settings, seed: currentDailySeed() };
  }
}

export function currentDailySeed(): number {
  return dateToSeed(new Date());
}

export function dateToSeed(date: Date): number {
  return Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
}

export function seedToDate(seed: number): Date {
  return new Date(seed * 1000 * 60 * 60 * 24);
}

export function describeSeed(seed: number, mode: GameMode) {
  if (mode === "daily") {
    return seedToDate(seed).toLocaleDateString();
  } else {
    return "#" + seed.toString(36);
  }
}

function resultToEmoji(result: LetterResult): string {
  switch (result) {
    case "correct":
      return "🟩";
    case "valid":
      return "🟨";
    case "invalid":
      return "⬛";
  }
}

export function describeGameWithEmoji(game: GameState): string {
  let description: string[] = [];

  description.push(`two|rds ${game.mode} ${describeSeed(game.seed, game.mode)}`);

  const scores = game.boards
    .map((board) => (board.status === "won" ? board.previousGuesses.length - board.freeGuesses : "X"))
    .join("|");

  const points = game.boards
    .map((board) => (board.status !== "won" ? 0 : 1 + board.guessLimit - board.previousGuesses.length))
    .reduce((sum, i) => sum + i, 0);

  let rows = Math.max(...game.boards.map((board) => board.previousGuesses.length));
  if (game.status === "lost") {
    // Add additional row for lost boards
    rows++;
  }
  description.push(`${scores} (${points}pts)`);

  for (let i = 0; i < rows; i++) {
    const currentRowDescriptions: string[] = [];

    for (const board of game.boards) {
      const guess = board.previousGuesses[i];
      if (guess) {
        currentRowDescriptions.push(guess.map((letter) => resultToEmoji(letter.result)).join(""));
      } else {
        const emoji = board.status === "won" ? resultToEmoji("correct") : "🟥";
        currentRowDescriptions.push(new Array(board.answer.length).fill(emoji).join(""));
      }
    }

    // unicode em space
    description.push(currentRowDescriptions.join("\u2003"));
  }

  const url = window.location.origin + "/?" + game.mode;
  description.push(url);

  return description.join("\n");
}
