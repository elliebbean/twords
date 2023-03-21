import { CheckedWord } from "services/wordCheck";
import styled from "styled-components";

interface LineProps {
  guess: CheckedWord | string;
  length: number;
  showResults?: boolean;
  failure?: boolean;
}

const LineContiner = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
`;

const Letter = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  display: inline-flex;
  flex: 1 1;
  aspect-ratio: 1/1;
  justify-content: center;
  align-items: center;
  //margin: 2px;
  border: 1px solid #555;
  text-transform: uppercase;
  font-size: 2rem;
  font-weight: bold;
  transition: background-color 0.25s ease-in;

  @media (max-width: 500px), (max-height: 850px) {
    font-size: 1.25rem;
  }
`;

function Line(props: LineProps) {
  const { guess, length, showResults, failure } = props;

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
      <Letter color={color} key={i}>
        {guessLetter}
      </Letter>
    );
  });

  return <LineContiner>{letters}</LineContiner>;
}

export default Line;