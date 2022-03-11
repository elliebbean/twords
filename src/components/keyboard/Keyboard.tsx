import { useSettings } from "hooks/settings";
import { LetterResult } from "services/wordCheck";
import "./Keyboard.css";

const Backspace = "⌫";
const Enter = "↩";

const qwertyLayout = (specialKey1: string, specialKey2: string) => [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  [specialKey1, "z", "x", "c", "v", "b", "n", "m", specialKey2],
];

const specialKeys: { [index: string]: string } = {
  [Backspace]: "Backspace",
  [Enter]: "Enter",
};
interface KeyboardProps {
  letterInfo: Map<string, LetterResult>[];
  onKey: (key: string) => void;
}

function Keyboard({ letterInfo, onKey }: KeyboardProps) {
  const [settings] = useSettings();

  const keys = settings.flipKeyboardButtons ? qwertyLayout(Enter, Backspace) : qwertyLayout(Backspace, Enter);

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
