import Line from "components/line/Line";
import Modal from "components/modal/Modal";
import { checkWord } from "services/wordCheck";
import "./HelpModal.css";

function HelpModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Help">
      <div className="help-modal">
        <p>
          Guess <strong>two</strong> secret words in <strong>six</strong> guesses.
        </p>
        <p>You start with some free clues, and each guess gives you more.</p>

        <h2>Example</h2>
        <figure>
          <Line guess={checkWord("mile", "bean")} length={4} showResults={true} />
          <figcaption>
            <p>
              <strong>E</strong> is in this word, but not in that position.
            </p>
            <p>
              <strong>M</strong>, <strong>I</strong> and <strong>L</strong> are not in this word.
            </p>
          </figcaption>
        </figure>

        <figure>
          <Line guess={checkWord("beer", "bean")} length={4} showResults={true} />
          <figcaption>
            <p>
              <strong>B</strong> and <strong>E</strong> are in this word, in the correct positions.
            </p>
            <p>
              There is not a second <strong>E</strong> in this word.
            </p>
          </figcaption>
        </figure>

        <figure>
          <Line guess={checkWord("bean", "bean")} length={4} showResults={true} />
          <figcaption>
            <p>
              The word was <strong>BEAN</strong>! Now to guess the second one…
            </p>
          </figcaption>
        </figure>

        <p>
          Check out the source code and report issues <a href="https://github.com/avisgratis/twords">here</a>.
        </p>
      </div>
    </Modal>
  );
}

export default HelpModal;
