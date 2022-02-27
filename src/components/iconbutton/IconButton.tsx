import { ReactNode } from "react";
import "./IconButton.css";

interface IconButtonProps {
  children: ReactNode;
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function IconButton({ children, label, onClick }: IconButtonProps) {
  return (
    <button className="icon-button" onClick={onClick}>
      {children} <span className="visually-hidden">{label}</span>
    </button>
  );
}

export default IconButton;
