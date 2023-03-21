import Key from "components/Key";
import { useSettings } from "hooks/settings";
import { LetterResult } from "services/wordCheck";
import styled from "styled-components";

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

const Row = styled.div`
  display: flex;
`;

interface KeyboardProps {
  letterInfo: Map<string, LetterResult>[];
  fill?: "left" | "right";
  onKey: (key: string) => void;
}

function Keyboard({ letterInfo, fill, onKey }: KeyboardProps) {
  const [settings] = useSettings();

  const keys = settings.flipKeyboardButtons ? qwertyLayout(Enter, Backspace) : qwertyLayout(Backspace, Enter);

  return (
    <div className="keyboard">
      {keys.map((row, index) => (
        <Row key={index}>
          {row.map((letter) => {
            let keyValue = letter;
            let results: [LetterResult?, LetterResult?] | undefined = undefined;

            if (letter in specialKeys) {
              keyValue = specialKeys[letter];
            } else {
              results = [letterInfo[0]?.get(letter), letterInfo[1]?.get(letter)];
            }

            return <Key fill={fill} letter={letter} results={results} onPress={() => onKey(keyValue)} key={letter} />;
          })}
        </Row>
      ))}
    </div>
  );
}

export default Keyboard;
