import { CheckedWord } from "services/wordCheck";
import "./Line.css";

interface LineProps {
  guess: CheckedWord | string;
  length: number;
  showResults?: boolean;
  failure?: boolean;
}

function Line(props: LineProps) {
  const { guess, length, showResults, failure } = props;

  const letters = [...Array(length)].map((_, i) => {
    let classes = ["letter"];
    let guessLetter = "";

    if (i < guess.length) {
      if (typeof guess === "string") {
        guessLetter = guess[i];
      } else {
        guessLetter = guess[i].letter;
      }

      if (showResults && typeof guess === "object") {
        classes.push(guess[i].result);
      }

      if (failure) {
        classes.push("failure");
      }
    }

    return (
      <div className={classes.join(" ")} key={i}>
        {guessLetter}
      </div>
    );
  });

  return <div className="line">{letters}</div>;
}

export default Line;
