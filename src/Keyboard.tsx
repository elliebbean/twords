import { LetterResult } from "./wordCheck";

const keys = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["⌫", "z", "x", "c", "v", "b", "n", "m", "↩"]
];

const specialKeys: { [index: string]: string } = {
    "⌫": "Backspace",
    "↩": "Enter",
}

interface KeyboardProps {
    letterInfo: Map<string, LetterResult[]>,
    onKey: (key: string) => void
}

function Keyboard({ letterInfo, onKey }: KeyboardProps) {
    return (
        <div className="keyboard">
            {keys.map((row, index) =>
                <div className="row" key={index}>{
                    row.map(letter => {

                        const [leftClass, rightClass] = letterInfo.get(letter) ?? []
                        const classNames = ["key"];
                        let keyValue = letter;

                        if (leftClass != null) {
                            classNames.push(`left-${leftClass}`);
                        }

                        if (rightClass != null) {
                            classNames.push(`right-${rightClass}`);
                        }

                        if (letter in specialKeys) {
                            classNames.push("special")
                            keyValue = specialKeys[letter];
                        }

                        return <button onClick={() => onKey(keyValue)} className={classNames.join(" ")} key={letter}>{letter}</button>;
                    }
                    )}</div>)}
        </div>
    )
}

export default Keyboard;