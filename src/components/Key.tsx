import { LetterResult } from "services/wordCheck";
import styled from "styled-components";

function resultToColor(result?: LetterResult) {
  if (result) {
    return `var(--color-${result})`;
  } else {
    return "#5c5c5c";
  }
}

const KeyButton = styled.button<{ specialKey: boolean }>`
  display: inline-flex;
  flex: ${(props) => (props.specialKey ? 1.5 : 1)} 1;
  height: 3.5em;
  border: none;
  margin: 0;
  padding: 0.2em;
  background: transparent;
  justify-content: center;
  align-items: center;
  color: #cccccc;
  font-size: 1.25rem;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 0 0 4px black;
`;

const KeyInner = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
  background-color: #5c5c5c;
`;

const Letter = styled.div<{ leftColor: string; rightColor: string }>`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Color = styled.div<{ color: string; position: "left" | "right"; display: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  left: ${(props) => (props.position === "left" ? "" : "-") + (props.display ? "50%" : "100%")};
  transition: left 1s;
  background-color: ${(props) => props.color};
`;

interface KeyProps {
  letter: string;
  results?: [LetterResult?, LetterResult?];
  onPress: () => void;
}

export default function Key({ letter, results, onPress }: KeyProps) {
  const [leftResult, rightResult] = results ?? [];
  const [leftColor, rightColor] = results?.map(resultToColor) ?? ["#888", "#888"];

  const specialKey = results == null;

  return (
    <KeyButton specialKey={specialKey} onPointerDown={onPress}>
      <KeyInner>
        <Color position={"left"} color={leftColor} display={leftResult != null} />
        <Color position={"right"} color={rightColor} display={rightResult != null} />
        <Letter leftColor={leftColor} rightColor={rightColor}>
          {letter}
        </Letter>
      </KeyInner>
    </KeyButton>
  );
}
