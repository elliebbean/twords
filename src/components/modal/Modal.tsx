import IconButton from "components/iconbutton/IconButton";
import { CloseIcon } from "components/icons/Icons";
import { ReactNode, useEffect, useState } from "react";
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

  const startClosing = () => {
    setClosing(true);
    setModalClosing(true);
    setOverlayClosing(true);
  };

  useEffect(() => {
    if (isClosing && !overlayClosing && !modalClosing) {
      setClosing(false);
      onClose();
    }
  }, [isClosing, overlayClosing, modalClosing, onClose]);

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

  if (isOpen) {
    return ReactDOM.createPortal(
      <>
        {overlayClosing ? (
          <div className="overlay closing" onAnimationEnd={() => setOverlayClosing(false)} />
        ) : (
          <div className="overlay" onClick={startClosing} />
        )}

        {modalClosing ? (
          <div className="modal closing" onAnimationEnd={() => setModalClosing(false)}>
            {content}
          </div>
        ) : (
          <div className="modal">{content}</div>
        )}
      </>,
      document.body
    );
  } else {
    return null;
  }
}

export default Modal;
