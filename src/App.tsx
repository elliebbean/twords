import "App.css";
import Game from "components/game/Game";
import Header from "components/header/Header";
import HelpModal from "components/helpmodal/HelpModal";
import SettingsModal from "components/settingsmodal/SettingsModal";
import { SettingsProvider, useSettingsStore } from "hooks/settings";
import React, { useState } from "react";
import { GameMode } from "services/game";

function App() {
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const [settings, setSettings] = useSettingsStore();

  const searchParams = new URLSearchParams(window.location.search);
  let gameMode: GameMode = "daily";
  if (searchParams.has("random")) {
    gameMode = "random";
  } else if (searchParams.has("endless")) {
    gameMode = "endless";
  }

  return (
    <SettingsProvider value={[settings, setSettings]}>
      <div className={`app${settings.highContrast ? " high-contrast" : ""}`}>
        <div className="center">
          <Header onHelpButton={() => setHelpModalOpen(true)} onSettingsButton={() => setSettingsModalOpen(true)} />
          <Game mode={gameMode} />
        </div>
        <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
        <SettingsModal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
      </div>
    </SettingsProvider>
  );
}

export default App;
