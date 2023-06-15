import styled from "styled-components";

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

const SwitchLabel = styled.label`
  width: 100%;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: space-between;
`;

const SwitchDiv = styled.div<{ checked: boolean }>`
  width: 100%;
  padding: 0.5em;
  margin-block: 0.5em;
  border-radius: 0.5em;
  border: 1px solid #101017;
  background: ${(props) => (props.checked ? "#35353f" : "#202027")};
`;

function Switch(props: SwitchProps) {
  return (
    <SwitchDiv checked={props.checked ?? false}>
      <SwitchLabel>
        {props.label}
        <input
          type="checkbox"
          checked={props.checked}
          onChange={(e) => props.onChange && props.onChange(e.target.checked)}
        />
      </SwitchLabel>
    </SwitchDiv>
  );
}

export default Switch;
