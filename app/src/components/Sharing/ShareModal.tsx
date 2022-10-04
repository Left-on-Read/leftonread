/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
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
import { FiCopy, FiMessageCircle } from 'react-icons/fi';
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
  title,
  contacts,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  graphRefToShare?: React.MutableRefObject<null>;
  title: string;
  contacts?: string[];
}) {
  const [copied, setCopied] = useState<boolean>();
  const [isIMessageAppLoading, setIsIMessageAppLoading] = useState<boolean>();

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopy = () => {
    if (graphRefToShare && graphRefToShare.current) {
      const { current } = graphRefToShare;

      // NOTE(Danilowicz): Update ref type to be chartjs component
      // @ts-ignore
      const base64Image = current.toBase64Image();

      const nativeImg = electron.nativeImage.createFromDataURL(base64Image);

      electron.clipboard.write({
        image: nativeImg,
      });

      logEvent({
        eventName: 'COPIED_GRAPH_TO_CLIPBOARD',
        properties: {
          name: title,
        },
      });
    }
  };

  const socialMediaBox = (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '0px 20px',
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
      <LeftOnReadSocialIcon
        network="reddit"
        onClick={() => {
          externalWindowOpen('https://www.reddit.com');
        }}
      />
      {/* <LeftOnReadSocialIcon
        network="tiktok"
        onClick={() => {
          externalWindowOpen('https://www.tiktok.com');
        }}
      /> */}
      {/* <LeftOnReadSocialIcon
        network="linkedin"
        onClick={() => {
          externalWindowOpen('https://www.linkedin.com');
        }}
      /> */}
      <LeftOnReadSocialIcon
        network="facebook"
        onClick={() => {
          externalWindowOpen('https://www.facebook.com');
        }}
      />
    </Box>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent minWidth="550px">
        <ModalBody display="flex" justifyContent="center">
          {children}
        </ModalBody>
        <Divider />

        <ModalHeader>
          <Box
            style={{
              padding: '15px',
            }}
          >
            {/* <Box display="flex" justifyContent="center" alignItems="center"> */}
            {/* <Text textAlign="center" fontSize={24} color="gray.800">
              Share this graph
            </Text> */}
            {/* <Icon as={FiShare} /> */}
            {/* </Box> */}
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                // marginTop: '20px',
                marginBottom: '32px',
              }}
            >
              <Button
                rightIcon={<FiCopy />}
                disabled={copied}
                onClick={() => {
                  handleCopy();
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2500);
                }}
                size="md"
                style={{
                  transition: '.25s',
                }}
              >
                <span className="primary">
                  {copied ? <>Copied!</> : <>Copy Image</>}
                </span>
              </Button>
              <div style={{ margin: '0px 12px' }}>
                <Text fontSize="md">or</Text>
              </div>
              <Button
                rightIcon={<FiMessageCircle />}
                isLoading={isIMessageAppLoading}
                loadingText="Loading..."
                colorScheme="messenger"
                onClick={() => {
                  setIsIMessageAppLoading(true);
                  logEvent({
                    eventName: 'CLICKED_SHARE_SOCIAL_ICON',
                    properties: {
                      media: 'iMessage',
                    },
                  });
                  handleCopy();
                  openIMessageAndPasteImage(contacts);
                  setIsIMessageAppLoading(false);
                }}
                size="md"
                style={{
                  transition: '.25s',
                }}
              >
                Share with iMessage
              </Button>
              {/* </Box> */}
            </Box>
            {/* <Box>
              <Text color="gray" fontSize={14}>
                Post with{' '}
                <span style={{ color: defaultTheme.colors.purple['600'] }}>
                  #DownloadLeftOnRead
                </span>{' '}
                to win a $50 giftcard
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    fontSize: '10px',
                  }}
                >
                  <a href="https://leftonread.me/raffle-terms">
                    *terms and conditions apply
                  </a>
                </div>
              </Text>
            </Box> */}
            <Box>{socialMediaBox}</Box>
          </Box>
        </ModalHeader>
      </ModalContent>
    </Modal>
  );
}
