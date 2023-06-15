import { CheckedWord } from "services/wordCheck";
import styled, { keyframes } from "styled-components";

interface LineProps {
  guess: CheckedWord | string;
  length: number;
  showResults?: boolean;
  failure?: boolean;
  fragile?: boolean;
  error?: boolean;
}

const shakeAnimation = keyframes`
  0% {left: 0}
  25% {left: 5px}
  50% {left: 0}
  75% {left: -5px}
  100% {left: 0}
`;

const LineContiner = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
`;

const Letter = styled.div<{ color: string; dashed: boolean; error: boolean }>`
  background-color: ${(props) => props.color};
  display: inline-flex;
  flex: 1 1;
  aspect-ratio: 1/1;
  justify-content: center;
  align-items: center;
  border: 1px ${(props) => (props.dashed ? "dashed" : "solid")} #555;
  text-transform: uppercase;
  font-size: 2rem;
  font-weight: bold;
  transition: background-color 0.25s ease-in;
  user-select: none;
  position: relative;
  animation-name: ${(props) => (props.error ? shakeAnimation : "none")};
  animation-duration: 0.2s;
  animation-iteration-count: 3;
  animation-timing-function: ease;

  @media (max-width: 575px), (max-height: 850px) {
    font-size: 1.5rem;
  }
`;

function Line(props: LineProps) {
  const { guess, length, showResults, failure, fragile, error } = props;

  const letters = [...Array(length)].map((_, i) => {
    let guessLetter = "";
    let color = "transparent";

    if (i < guess.length) {
      if (typeof guess === "string") {
        guessLetter = guess[i];
      } else {
        guessLetter = guess[i].letter;
      }

      if (showResults && typeof guess === "object") {
        color = `var(--color-${guess[i].result})`;
      }

      if (failure) {
        color = `var(--color-failure)`;
      }
    }

    return (
      <Letter color={color} dashed={fragile ?? false} key={i} error={error ?? false}>
        {guessLetter}
      </Letter>
    );
  });

  return <LineContiner>{letters}</LineContiner>;
}

export default Line;
