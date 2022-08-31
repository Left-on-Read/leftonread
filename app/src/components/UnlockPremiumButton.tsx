import {
  Box,
  Button,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useState } from 'react';
import { FiLock } from 'react-icons/fi';

import { useGlobalContext } from './Dashboard/GlobalContext';
import { EmailModal } from './Support/EmailModal';

export function UnlockPremiumButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEmailModalOpen,
    onOpen: onEmailModalOpen,
    onClose: onEmailModalClose,
  } = useDisclosure();

  const [licenseKey, setLicenseKey] = useState<string>('');
  const { activatePremium } = useGlobalContext();

  const [isActivating, setIsActivating] = useState<boolean>(true);

  const activateLicenseKey = async () => {
    setIsActivating(true);

    try {
      const { activated, message } = await ipcRenderer.invoke(
        'activate-license',
        licenseKey
      );

      if (activated) {
        activatePremium();
      }
    } catch (e: unknown) {
      log.error(e);
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <>
      <Box shadow="2xl">
        <Button
          leftIcon={<Icon as={FiLock} />}
          bgGradient="linear(to-br, yellow.400, yellow.600)"
          colorScheme="yellow"
          onClick={() => {
            // window.open(
            //   'https://checkout.stripe.com/pay/cs_live_b1DBvSe1jfp8QHlIDbn6OO4J2J86GcwsH7qS5w9TFRasiTMKaVAoFrd5jl#fidkdWxOYHwnPyd1blppbHNgWjA0SVNMdHJGSkZzMGJ0YmQ2S2ZvS0lRVFF1TH10RlFoSms2UktObDJfSV9RNWowTGxrN2dKXVdVXHRMbDA1UU9Wazwwf39VYmpuN2hMU2R1fENcSnB8Nkg2NTVXVFc8YG8ydicpJ3VpbGtuQH11anZgYUxhJz8nM2pAZExCPW9DNlROPXdWZ0xOJ3gl'
            // );
            onOpen();
          }}
          color="white"
          fontWeight="medium"
          size="lg"
        >
          Unlock Premium
        </Button>
      </Box>
      <EmailModal isOpen={isEmailModalOpen} onClose={onEmailModalClose} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Unlock Premium</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <div>
              <Text fontWeight="medium" style={{ marginBottom: 6 }}>
                Your License Key
              </Text>
              <Input
                placeholder="LOR-365f9d34-6d39-4868-ae71"
                size="md"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                disabled={isActivating}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={activateLicenseKey}
              isLoading={isActivating}
              disabled={isActivating}
            >
              Activate
            </Button>
          </ModalFooter>
          <Button
            variant="link"
            fontSize="sm"
            onClick={() => onEmailModalOpen()}
            style={{ marginTop: 12, marginBottom: 12 }}
          >
            Need help?
          </Button>
        </ModalContent>
      </Modal>
    </>
  );
}
