/**
 * Correct - the letter is in the answer at this position
 * Valid - the letter is in the answer at a different position
 * Invalid - the letter is not in the answer
 */
export type LetterResult = "correct" | "valid" | "invalid";

export interface CheckedLetter {
    letter: string,
    result: LetterResult
}

/**
 * Check a word against an answer, giving a correct/valid/invalid result for each latter
 * @param guess Word to check
 * @param answer Answer to check against
 * @returns The individual letters of `guess` and their results
 */
export function checkWord(guess: string, answer: string): CheckedLetter[] {

    // Count the number of each letter in the guess that isn't a correct match
    const unmatchedLetters = new Map<string, number>();

    answer.split("").forEach((letter, index) => {
        if (letter !== guess[index]) {
            unmatchedLetters.set(letter, (unmatchedLetters.get(letter) ?? 0) + 1);
        }
    })

    let checkedWord: CheckedLetter[] = [];
    guess.split("").forEach((letter, index) => {
        if (letter === answer[index]) {
            checkedWord.push({ letter: letter, result: "correct" });
        }
        else if ((unmatchedLetters.get(letter) ?? 0) > 0) {
            checkedWord.push({ letter: letter, result: "valid" });
            unmatchedLetters.set(letter, (unmatchedLetters.get(letter) ?? 0) - 1);
        }
        else {
            checkedWord.push({ letter: letter, result: "invalid" })
        }
    });

    return checkedWord;
}

/**
 * Check all letters in an array of words, and get the most specific result for each letter
 * 
 * @param guesses Array of words to check
 * @param answer Answer to check against
 * @returns Map of letters to their most specific results in `guesses`
 */
export function checkAllLetters(guesses: string[], answer: string): Map<string, LetterResult> {

    const allLetterResults = new Map<string, LetterResult>();

    guesses.map(guess => checkWord(guess, answer)).flat().forEach(({ letter, result }) => {
        if (!allLetterResults.has(letter) || result === "correct") {
            allLetterResults.set(letter, result);
        }
        else if (result === "valid" && allLetterResults.get(letter) !== "correct") {
            allLetterResults.set(letter, result);
        }
        else if (result === "invalid" && allLetterResults.get(letter) !== "correct" && allLetterResults.get(letter) !== "valid") {
            allLetterResults.set(letter, result);
        }
    });

    return allLetterResults;
}

/**
 * Check all letters in an array of words against multiple answers
 * 
 * @param guesses Array of words to check
 * @param answers Array of answers to check against
 * @returns Map of letters to an array of their most specific results in `guesses` for each answer in `answers`
 */
export function checkAllLettersMultipleAnswers(guesses: string[], answers: string[]): Map<string, LetterResult[]> {

    const allLetterResults = new Map<string, LetterResult[]>();

    answers.map(answer => checkAllLetters(guesses, answer)).forEach(results => {
        for (const [letter, result] of results.entries()) {
            if (allLetterResults.has(letter)) {
                allLetterResults.get(letter)?.push(result);
            } else {
                allLetterResults.set(letter, [result])
            }
        }
    });

    return allLetterResults;
}