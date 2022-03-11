import Modal from "components/modal/Modal";
import Switch from "components/switch/Switch";
import { useSettings } from "hooks/settings";
import "./SettingsModal.css";

function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [settings, setSettings] = useSettings();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="settings-modal">
        <Switch
          label={"Flip Keyboard Buttons"}
          checked={settings.flipKeyboardButtons}
          onChange={(checked) => setSettings((settings) => ({ ...settings, flipKeyboardButtons: checked }))}
        />
        <Switch
          label={"High Contrast Colors"}
          checked={settings.highContrast}
          onChange={(checked) => setSettings((settings) => ({ ...settings, highContrast: checked }))}
        />
      </div>
    </Modal>
  );
}

export default SettingsModal;
