import Line from "components/Line";
import Modal from "components/modal/Modal";
import { ReactNode } from "react";
import { checkWord } from "services/wordCheck";
import styled from "styled-components";

const Figure = styled.figure`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LineWrapper = styled.div`
  max-width: 16em;
  width: 100%;
  padding-bottom: 0.2em;
`;

const Example = ({ guess, answer, children }: { guess: string; answer: string; children: ReactNode }) => (
  <Figure>
    <LineWrapper>
      <Line guess={checkWord(guess, answer)} length={4} showResults={true} />
    </LineWrapper>
    <figcaption>{children}</figcaption>
  </Figure>
);

function HelpModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Help">
      <div className="help-modal">
        <p>
          Guess <strong>two</strong> secret words in <strong>six</strong> guesses.
        </p>
        <p>You start with some free clues, and each guess gives you more.</p>

        <h2>Example</h2>
        <Example guess="mile" answer="bean">
          <p>
            <strong>E</strong> is in this word, but not in that position.
          </p>
          <p>
            <strong>M</strong>, <strong>I</strong> and <strong>L</strong> are not in this word.
          </p>
        </Example>

        <Example guess="beer" answer="bean">
          <p>
            <strong>B</strong> and <strong>E</strong> are in this word, in the correct positions.
          </p>
          <p>
            There is not a second <strong>E</strong> in this word.
          </p>
        </Example>

        <Example guess="bean" answer="bean">
          <p>
            The word was <strong>BEAN</strong>! Now to guess the second one…
          </p>
        </Example>

        <p>
          Check out the source code and report issues <a href="https://github.com/avisgratis/twords">here</a>.
        </p>
      </div>
    </Modal>
  );
}

export default HelpModal;
