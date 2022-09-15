import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { NotificationSettings } from 'constants/types';
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';

export function NotificationSettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notifSettings, setNotifSettings] =
    useState<NotificationSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      const settings = await ipcRenderer.invoke('get-notification-settings');
      setNotifSettings(settings);
      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Notification Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Checkbox
            colorScheme="purple"
            checked={!!notifSettings?.responseRemindersEnabled}
            onChange={(event) => {
              setNotifSettings({
                ...notifSettings,
                responseRemindersEnabled: event.target.checked,
              });
            }}
            disabled={isLoading}
            defaultChecked={notifSettings?.responseRemindersEnabled}
          >
            Response Reminders
          </Checkbox>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="purple"
            mr={3}
            onClick={() => {
              ipcRenderer.invoke('set-notification-settings', notifSettings);
              onClose();
            }}
            isLoading={isLoading}
            loadingText="Loading Settings..."
          >
            Save & Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
