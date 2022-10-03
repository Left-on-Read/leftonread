import {
  Button,
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
import Confetti from 'react-confetti';

import Celebration from '../../../assets/illustrations/celebration.svg';
import { logEvent } from '../../utils/analytics';
import { Float } from '../Float';
import { EmailModal } from '../Support/EmailModal';
import { STRIPE_LINK } from './constants';
import { useGoldContext } from './GoldContext';

export function PremiumModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { setPremium } = useGoldContext();

  const {
    isOpen: isEmailModalOpen,
    onOpen: onEmailModalOpen,
    onClose: onEmailModalClose,
  } = useDisclosure();
  const [licenseKey, setLicenseKey] = useState<string>('');
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isActivationSuccessful, setIsActivationSuccessful] =
    useState<boolean>(false);

  const checkLicenseKey = () => {
    setError(null);
    if (!licenseKey.startsWith('LOR-')) {
      setError('License Key must begin with "LOR-"');
      return false;
    }

    return true;
  };

  const activateLicenseKey = async () => {
    if (!checkLicenseKey()) {
      return;
    }

    setIsActivating(true);

    try {
      const { activated, message } = await ipcRenderer.invoke(
        'activate-license',
        licenseKey
      );

      if (activated) {
        setIsActivationSuccessful(true);
      } else {
        setError(message);
        logEvent({
          eventName: 'ACTIVATION_ERROR',
          properties: {
            error: message,
          },
        });
      }
    } catch (e: unknown) {
      log.error(e);
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setIsActivating(false);
    }
  };

  const closeHandler = () => {
    if (isActivationSuccessful) {
      setPremium(true);
    }

    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeHandler}>
        <ModalOverlay />
        <ModalContent>
          {isActivationSuccessful ? (
            <>
              <ModalHeader>Gold Unlocked</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Confetti
                    width={440}
                    height={350}
                    recycle={false}
                    numberOfPieces={200}
                  />
                  <Float
                    circleShadowDimensions={{
                      marginTop: 20,
                      width: 120,
                    }}
                  >
                    <img
                      src={Celebration}
                      alt="Working hard"
                      style={{
                        width: '200px',
                        border: '1px solid lightgray',
                        borderRadius: '50%',
                      }}
                    />
                  </Float>
                  <Text
                    style={{ marginTop: 16 }}
                    fontWeight="medium"
                    fontSize="lg"
                  >
                    Thanks for supporting Left on Read!
                  </Text>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="purple" onClick={closeHandler}>
                  See New Analytics
                </Button>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader>Unlock Gold</ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                <div>
                  <Text fontWeight="medium" style={{ marginBottom: 6 }}>
                    Enter Your License Key
                  </Text>
                  <Input
                    placeholder="e.g. LOR-365f9d34-6d39-4868"
                    size="md"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    disabled={isActivating}
                  />
                  {error && (
                    <div style={{ marginTop: 6 }}>
                      <Text color="red.400">{error}</Text>
                    </div>
                  )}
                  <Button
                    variant="link"
                    color="gray.600"
                    fontSize={14}
                    style={{ marginTop: 24 }}
                    onClick={() => {
                      logEvent({
                        eventName: 'NO_LICENSE_KEY',
                      });
                      window.open(STRIPE_LINK);
                    }}
                  >
                    {`Don't have a license key? Get one here 🎉`}
                  </Button>
                  <Text
                    color="gray.400"
                    fontSize={14}
                    fontWeight="medium"
                    style={{ marginTop: 6 }}
                  >
                    Purchased a key? Check your email.
                  </Text>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={() => {
                    logEvent({
                      eventName: 'ACTIVATE_KEY',
                    });
                    activateLicenseKey();
                  }}
                  isLoading={isActivating}
                  disabled={isActivating}
                  loadingText="Activating..."
                  colorScheme="purple"
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
            </>
          )}
        </ModalContent>
      </Modal>
      <EmailModal isOpen={isEmailModalOpen} onClose={onEmailModalClose} />
    </>
  );
}
