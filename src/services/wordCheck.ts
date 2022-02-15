/**
 * The result of a checked letter:
 * * `correct` - the letter is in the answer at this position
 * * `valid` - the letter is in the answer at a different position
 * * `invalid` - the letter is not in the answer
 */
export type LetterResult = "correct" | "valid" | "invalid";

export interface CheckedLetter {
  letter: string;
  result: LetterResult;
}

export type CheckedWord = CheckedLetter[];

/**
 * Check a word against an answer, giving a correct/valid/invalid result for each latter
 * @param guess Word to check
 * @param answer Answer to check against
 * @returns The individual letters of `guess` and their results
 */
export function checkWord(guess: string, answer: string): CheckedWord {
  // Count the number of each letter in the guess that isn't a correct match
  const unmatchedLetters = new Map<string, number>();

  answer.split("").forEach((letter, index) => {
    if (letter !== guess[index]) {
      unmatchedLetters.set(letter, (unmatchedLetters.get(letter) ?? 0) + 1);
    }
  });

  let checkedWord: CheckedWord = [];
  guess
    .split("")
    .slice(0, answer.length)
    .forEach((letter, index) => {
      if (letter === answer[index]) {
        checkedWord.push({ letter: letter, result: "correct" });
      } else if ((unmatchedLetters.get(letter) ?? 0) > 0) {
        checkedWord.push({ letter: letter, result: "valid" });
        unmatchedLetters.set(letter, (unmatchedLetters.get(letter) ?? 0) - 1);
      } else {
        checkedWord.push({ letter: letter, result: "invalid" });
      }
    });

  return checkedWord;
}

/**
 * Combine all the checked letters from an array of words, getting the most specific result for each letter
 * (`correct` > `valid` > `invalid`)
 *
 * @param words Array of checked words to get letters from
 * @returns Map of letters to their most specific result
 */
export function getAllLetterResults(words: CheckedWord[]): Map<string, LetterResult> {
  const letterResults = new Map<string, LetterResult>();

  words.flat().forEach(({ letter, result }) => {
    if (!letterResults.has(letter) || result === "correct") {
      letterResults.set(letter, result);
    } else if (result === "valid" && letterResults.get(letter) !== "correct") {
      letterResults.set(letter, result);
    }
    // We don't need to cover the result === "invalid" case explicitly, as
    // that should only be set if the letter hasn't been set previously.
  });

  return letterResults;
}
