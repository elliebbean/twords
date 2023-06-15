import "App.css";
import Game from "components/Game";
import Header from "components/header/Header";
import HelpModal from "components/HelpModal";
import SettingsModal from "components/SettingsModal";
import { SettingsProvider, useSettingsStore } from "hooks/settings";
import { useState } from "react";
import { GameMode } from "services/game";

function App() {
  const [settings, setSettings] = useSettingsStore();
  const [helpModalOpen, setHelpModalOpen] = useState(!settings.helpViewed);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const closeHelp = () => {
    setHelpModalOpen(false);
    setSettings((settings) => ({ ...settings, helpViewed: true }));
  };

  let gameMode: GameMode = "endless";

  return (
    <SettingsProvider value={[settings, setSettings]}>
      <div className={`app${settings.highContrast ? " high-contrast" : ""}`}>
        <div className="center">
          <Header onHelpButton={() => setHelpModalOpen(true)} onSettingsButton={() => setSettingsModalOpen(true)} />
          <Game mode={gameMode} />
        </div>
        <HelpModal isOpen={helpModalOpen} onClose={closeHelp} />
        <SettingsModal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
      </div>
    </SettingsProvider>
  );
}

export default App;
