import { LetterResult } from "services/wordCheck";
import styled from "styled-components";

interface KeyProps {
  letter: string;
  results?: [LetterResult?, LetterResult?];
  onPress: () => void;
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

const Letter = styled.div<{ leftColor: string; rightColor: string }>`
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, ${(props) => props.leftColor} 50%, ${(props) => props.rightColor} 50%);
`;

export default function Key({ letter, results, onPress }: KeyProps) {
  const [leftColor, rightColor] = results?.map((result) => (result ? `var(--color-${result})` : "#5c5c5c")) ?? [
    "#888",
    "#888",
  ];

  const specialKey = results == null;

  return (
    <KeyButton specialKey={specialKey} onPointerDown={onPress}>
      <Letter leftColor={leftColor} rightColor={rightColor}>
        {letter}
      </Letter>
    </KeyButton>
  );
}
