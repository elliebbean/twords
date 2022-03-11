import IconButton from "components/iconbutton/IconButton";
import { HelpIcon, SettingsIcon } from "components/icons/Icons";
import "./Header.css";

interface HeaderProps {
  onHelpButton: () => void;
  onSettingsButton: () => void;
}

function Header(props: HeaderProps) {
  return (
    <header>
      <div></div>
      <h1>two|rds</h1>
      <div>
        <IconButton label={"Help"} onClick={props.onHelpButton}>
          <HelpIcon />
        </IconButton>
        <IconButton label={"Settings"} onClick={props.onSettingsButton}>
          <SettingsIcon />
        </IconButton>
      </div>
    </header>
  );
}

export default Header;
