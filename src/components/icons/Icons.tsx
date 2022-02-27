import { ReactComponent as CloseSvg } from "assets/icons/close.svg";
import { ReactComponent as HelpSvg } from "assets/icons/help.svg";
import { ReactComponent as SettingsSvg } from "assets/icons/settings.svg";
import "./icons.css";

export function CloseIcon() {
  return <CloseSvg className="icon" />;
}

export function HelpIcon() {
  return <HelpSvg className="icon" />;
}

export function SettingsIcon() {
  return <SettingsSvg className="icon" />;
}
