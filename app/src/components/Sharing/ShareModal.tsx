import {
  Box,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import electron from 'electron';
import { useEffect, useState } from 'react';
import { SocialIcon } from 'react-social-icons';

import { logEvent } from '../../utils/analytics';
import { openIMessageAndPasteImage } from '../../utils/appleScriptCommands';

function LeftOnReadSocialIcon({
  network,
  onClick,
}: {
  network: string;
  onClick: () => void;
}) {
  const size = 35;
  return (
    <SocialIcon
      style={{ width: size, height: size, cursor: 'pointer' }}
      onClick={() => {
        logEvent({
          eventName: 'CLICKED_SHARE_SOCIAL_ICON',
          properties: {
            media: network,
          },
        });
        onClick();
      }}
      network={network}
    />
  );
}

function externalWindowOpen(exteriorLink: string) {
  window.open(
    exteriorLink,
    '_blank',
    'top=500,left=200,frame=false,nodeIntegration=no'
  );
}

export function ShareModal({
  isOpen,
  onClose,
  children,
  graphRefToShare,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  graphRefToShare?: React.MutableRefObject<null>;
}) {
  const [copied, setCopied] = useState<boolean>();

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopy = () => {
    if (graphRefToShare && graphRefToShare.current) {
      const { current } = graphRefToShare;

      // NOTE(Danilowicz): Not sure why it says toBase64Image doesn't exist
      // @ts-ignore
      const base64Image = current.toBase64Image();

      const nativeImg = electron.nativeImage.createFromDataURL(base64Image);

      electron.clipboard.write({
        image: nativeImg,
      });

      logEvent({
        eventName: 'COPIED_GRAPH_TO_CLIPBOARD',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent style={{ width: '80vw' }}>
        <ModalHeader>
          <Box
            style={{
              padding: '15px',
            }}
          >
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '30px',
              }}
            >
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Text color="gray.800"> Share this graph</Text>
              </Box>
              <Button
                disabled={copied}
                colorScheme="purple"
                onClick={() => {
                  handleCopy();
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2500);
                }}
                size="sm"
                style={{
                  transition: '.25s',
                }}
              >
                <span className="primary">
                  {copied ? <>Copied!</> : <>Copy to clipboard</>}
                </span>
              </Button>
            </Box>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <LeftOnReadSocialIcon
                network="twitter"
                onClick={() => {
                  externalWindowOpen('https://www.twitter.com');
                }}
              />

              <LeftOnReadSocialIcon
                network="instagram"
                onClick={() => {
                  externalWindowOpen('https://www.instagram.com');
                }}
              />

              {/** Todo: tik tok logo */}
              <LeftOnReadSocialIcon
                network="twitch"
                onClick={() => {
                  externalWindowOpen('https://www.twitch.tv');
                }}
              />

              {/** Todo:imessage logo */}
              <LeftOnReadSocialIcon
                network="whatsapp"
                onClick={() => {
                  openIMessageAndPasteImage();
                }}
              />

              {/** Todo add reddit logo */}
              <LeftOnReadSocialIcon
                network="snapchat"
                onClick={() => {
                  externalWindowOpen('https://www.snapchat.com');
                }}
              />

              <LeftOnReadSocialIcon
                network="linkedin"
                onClick={() => {
                  externalWindowOpen('https://www.linkedin.com');
                }}
              />
            </Box>
          </Box>
          <Divider />
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
