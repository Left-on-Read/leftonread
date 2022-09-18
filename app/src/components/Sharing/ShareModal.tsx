import {
  Box,
  Button,
  Divider,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import electron from 'electron';
import { useEffect, useState } from 'react';
import { FiFacebook, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { SocialIcon } from 'react-social-icons';

import { logEvent } from '../../utils/analytics';
import { openIMessage } from '../../utils/appleScriptCommands';

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
              padding: '10px',
            }}
          >
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
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
              <SocialIcon
                onClick={() => {
                  logEvent({
                    eventName: 'CLICKED_SHARE_SOCIAL_ICON',
                    properties: {
                      media: 'Instagram',
                    },
                  });
                  window.open(
                    'https://www.instagram.com/accounts/login/',
                    '_blank',
                    'top=500,left=200,frame=false,nodeIntegration=no'
                  );
                }}
                network="instagram"
              />
              <SocialIcon
                onClick={() => {
                  logEvent({
                    eventName: 'CLICKED_SHARE_SOCIAL_ICON',
                    properties: {
                      media: 'Facebook',
                    },
                  });
                  window.open(
                    'https://www.facebook.com/',
                    '_blank',
                    'top=500,left=200,frame=false,nodeIntegration=no'
                  );
                }}
                network="facebook"
              />
              <SocialIcon
                onClick={() => {
                  logEvent({
                    eventName: 'CLICKED_SHARE_SOCIAL_ICON',
                    properties: {
                      media: 'Twitter',
                    },
                  });
                  window.open(
                    'https://twitter.com/',
                    '_blank',
                    'top=500,left=200,frame=false,nodeIntegration=no'
                  );
                }}
                network="twitter"
              />
              {/* <SocialIcon
                onClick={() => {
                  logEvent({
                    eventName: 'CLICKED_SHARE_SOCIAL_ICON',
                    properties: {
                      media: 'Tik Tok',
                    },
                  });
                  window.open(
                    'https://www.tiktok.com/',
                    '_blank',
                    'top=500,left=200,frame=false,nodeIntegration=no'
                  );
                }}
                network="Tiktok"
              /> */}
              {/* <Icon
                as={FiFacebook}
                attributeName="iMessage"
                onClick={() => {
                  logEvent({
                    eventName: 'CLICKED_SHARE_SOCIAL_ICON',
                    properties: {
                      media: 'iMessage',
                    },
                  });
                  openIMessage();
                }}
              /> */}
              <SocialIcon
                onClick={() => {
                  logEvent({
                    eventName: 'CLICKED_SHARE_SOCIAL_ICON',
                    properties: {
                      media: 'LinkedIn',
                    },
                  });
                  window.open(
                    'https://www.linkedin.com/feed/',
                    '_blank',
                    'top=500,left=200,frame=false,nodeIntegration=no'
                  );
                }}
                network="linkedin"
              />
              {/* <Icon
                as={FiLinkedin}
                attributeName="Reddit"
                onClick={() => {
                  logEvent({
                    eventName: 'CLICKED_SHARE_SOCIAL_ICON',
                    properties: {
                      media: 'Reddit',
                    },
                  });
                  window.open('www.reddit.com');
                }}
              /> */}
            </Box>
          </Box>
          <Divider />
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
