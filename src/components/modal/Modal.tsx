import IconButton from "components/iconbutton/IconButton";
import { CloseIcon } from "components/icons/Icons";
import FocusTrap from "focus-trap-react";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [isClosing, setClosing] = useState(false);
  const [overlayClosing, setOverlayClosing] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);

  const startClosing = useCallback(() => {
    if (isOpen && !isClosing) {
      setModalClosing(true);
      setOverlayClosing(true);
      setClosing(true);
    }
  }, [isOpen, isClosing]);

  useEffect(() => {
    if (isClosing && !overlayClosing && !modalClosing) {
      setClosing(false);
      onClose();
    }
  }, [isClosing, overlayClosing, modalClosing, onClose]);

  useEffect(() => {
    if (isOpen && !isClosing) {
      const keyDownListener = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          startClosing();
        }
      };

      document.addEventListener("keydown", keyDownListener);

      return () => {
        document.removeEventListener("keydown", keyDownListener);
      };
    }
  }, [isOpen, isClosing, startClosing]);

  if (isOpen) {
    const content = (
      <>
        <div className="modal-header">
          <h1>{title}</h1>
          <IconButton label={"Close"} onClick={startClosing}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="modal-content">{children}</div>
      </>
    );

    return ReactDOM.createPortal(
      <>
        <FocusTrap>
          <div>
            {isClosing ? (
              <div className="overlay closing" onAnimationEnd={() => setOverlayClosing(false)} />
            ) : (
              <div className="overlay" onClick={startClosing} />
            )}

            {isClosing ? (
              <div className="modal closing" onAnimationEnd={() => setModalClosing(false)}>
                {content}
              </div>
            ) : (
              <div className="modal">{content}</div>
            )}
          </div>
        </FocusTrap>
      </>,
      document.body
    );
  } else {
    return null;
  }
}

export default Modal;
