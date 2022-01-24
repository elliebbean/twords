
type LineProps = {
    guess: string;
    target: string;
    showResults: boolean;
}

function Line(props: LineProps) {

    const { guess, target } = props;
    const unmatchedLetters = target.split("").filter((targetLetter, index) => (props.guess[index] !== targetLetter));
    const letters = target.split("").map((targetLetter, index) => {

        var className = "Letter";
        var guessLetter = "";

        // Determine class for letter based on its occurence in the target
        if (index < props.guess.length) {

            guessLetter = guess[index];

            if (props.showResults) {
                if (guessLetter === targetLetter) {
                    className += " correct";
                }
                else if (unmatchedLetters.includes(guessLetter) && (guess.slice(0, index + 1).match(new RegExp(guessLetter, "g")) || []).length <= (target.match(new RegExp(guessLetter, "g")) || []).length) {
                    className += " valid";
                }
                else {
                    className += " invalid";
                }
            }
        }

        return <div className={className} key={index}>{guessLetter}</div>;
    });

    return (
        <div className="Line">{letters}</div>
    );
}

export default Line;