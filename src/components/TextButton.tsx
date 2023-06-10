import { ReactNode } from "react";
import styled from "styled-components";

interface TextButtonProps {
  children?: ReactNode;
  onClick?: () => void;
}

const Button = styled.button`
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  text-decoration: underline;
  color: #ccc;
  font-size: 1rem;

  &:hover {
    color: #fff;
  }
`;

function TextButton({ children, onClick }: TextButtonProps) {
  return <Button onClick={onClick}>{children}</Button>;
}

export default TextButton;
