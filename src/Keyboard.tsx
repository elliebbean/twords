import { LetterResult } from "./wordCheck";

const keys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["⌫", "z", "x", "c", "v", "b", "n", "m", "↩"],
];

const specialKeys: { [index: string]: string } = {
  "⌫": "Backspace",
  "↩": "Enter",
};

interface KeyboardProps {
  letterInfo: Map<string, LetterResult>[];
  onKey: (key: string) => void;
}

function Keyboard({ letterInfo, onKey }: KeyboardProps) {
  return (
    <div className="keyboard">
      {keys.map((row, index) => (
        <div className="row" key={index}>
          {row.map((letter) => {
            const classNames = ["key"];
            let keyValue = letter;

            if (letter in specialKeys) {
              classNames.push("special");
              keyValue = specialKeys[letter];
            } else {
              const leftResult = letterInfo[0]?.get(letter);
              const rightResult = letterInfo[1]?.get(letter);

              if (leftResult != null) {
                classNames.push(`left-${leftResult}`);
              }

              if (rightResult != null) {
                classNames.push(`right-${rightResult}`);
              }
            }

            return (
              <button onPointerDown={() => onKey(keyValue)} className={classNames.join(" ")} key={letter}>
                <div>{letter}</div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
