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

const KeyInner = styled.div<{ specialKey: boolean }>`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
  background-color: ${(props) => (props.specialKey ? "#999" : "#5c5c5c")};
`;

const Letter = styled.div<{ leftColor: string; rightColor: string }>`
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Color = styled.div<{ color: string; position: "left" | "right"; offset: string }>`
  width: 100%;
  height: 100%;
  position: absolute;
  right: ${(props) => (props.position === "left" ? "" : "-") + props.offset};
  transition: right 1s;
  background-color: ${(props) => props.color};
`;

interface KeyProps {
  letter: string;
  results?: [LetterResult?, LetterResult?];
  onPress: () => void;
  fill?: "left" | "right";
}
export default function Key({ letter, results, onPress, fill }: KeyProps) {
  const [leftResult, rightResult] = results ?? [];
  const [leftColor, rightColor] = results?.map(resultToColor) ?? [];

  let leftOffset = "50%",
    rightOffset = "50%";

  if (fill) {
    if (fill === "left") {
      leftOffset = "0%";
      rightOffset = "100%";
    } else {
      leftOffset = "100%";
      rightOffset = "0%";
    }
  }

  if (leftResult == null) {
    leftOffset = "100%";
  }

  if (rightResult == null) {
    rightOffset = "100%";
  }

  const specialKey = results == null;

  return (
    <KeyButton specialKey={specialKey} onPointerDown={onPress}>
      <KeyInner specialKey={specialKey}>
        <Color position={"left"} color={leftColor} offset={leftOffset} />
        <Color position={"right"} color={rightColor} offset={rightOffset} />
        <Letter leftColor={leftColor} rightColor={rightColor}>
          {letter}
        </Letter>
      </KeyInner>
    </KeyButton>
  );
}
