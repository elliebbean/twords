import "./Switch.css";

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

function Switch(props: SwitchProps) {
  let classNames = ["switch"];
  if (props.checked) classNames.push("checked");

  return (
    <div className={classNames.join(" ")}>
      <label>
        {props.label}
        <input
          type="checkbox"
          checked={props.checked}
          onChange={(e) => props.onChange && props.onChange(e.target.checked)}
        />
      </label>
    </div>
  );
}

export default Switch;
