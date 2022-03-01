import "App.css";
import Game from "components/game/Game";
import Header from "components/header/Header";
import HelpModal from "components/helpmodal/HelpModal";
import Modal from "components/modal/Modal";
import { useState } from "react";
import { GameMode } from "services/game";

function App() {
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  let gameMode: GameMode = "daily";
  if (searchParams.has("random")) {
    gameMode = "random";
  }

  return (
    <>
      <div className="app">
        <div className="center">
          <Header onHelpButton={() => setHelpModalOpen(true)} onSettingsButton={() => setSettingsModalOpen(true)} />
          <Game mode={gameMode} />
        </div>
      </div>
      <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
      <Modal isOpen={settingsModalOpen} title="Settings" onClose={() => setSettingsModalOpen(false)}>
        Settings
      </Modal>
    </>
  );
}

export default App;
