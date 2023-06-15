import Switch from "components/Switch";
import Modal from "components/modal/Modal";
import { useSettings } from "hooks/settings";
import styled from "styled-components";

const SettingsDiv = styled.div`
  min-width: 24em;
`;

function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [settings, setSettings] = useSettings();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <SettingsDiv>
        <Switch
          label={"Flip Keyboard Buttons"}
          checked={settings.flipKeyboardButtons ?? false}
          onChange={(checked) => setSettings((settings) => ({ ...settings, flipKeyboardButtons: checked }))}
        />
        <Switch
          label={"High Contrast Colors"}
          checked={settings.highContrast ?? false}
          onChange={(checked) => setSettings((settings) => ({ ...settings, highContrast: checked }))}
        />
      </SettingsDiv>
    </Modal>
  );
}

export default SettingsModal;
