import React, { useContext } from "react";
import { useStoredState } from "./storedState";

export interface Settings {
  darkTheme?: boolean;
  highContrast?: boolean;
  flipKeyboardButtons?: boolean;
  helpViewed?: boolean;
}

const SettingsContext = React.createContext<
  [Settings, (settings: Settings | ((settings: Settings) => Settings)) => void]
>([{}, () => {}]);

export const SettingsProvider = SettingsContext.Provider;

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const useSettingsStore = () => {
  return useStoredState<Settings>("settings", {});
};
