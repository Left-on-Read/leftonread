import { CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Skeleton,
  Stack,
  Text,
  theme as defaultTheme,
} from '@chakra-ui/react';
import download from 'downloadjs';
import electron from 'electron';
import { toPng } from 'html-to-image';
import { useEffect, useState } from 'react';
import {
  FiDownload,
  FiInstagram,
  FiMessageCircle,
  FiTwitter,
} from 'react-icons/fi';

import { logEvent } from '../../../utils/analytics';
import { openIMessageAndPasteImage } from '../../../utils/appleScriptCommands';

export function WrappedShareModal({
  isOpen,
  onClose,
  contentRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [copied, setCopied] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>('');

  const currentRef = contentRef.current;

  useEffect(() => {
    if (isOpen) {
      const generateImage = async () => {
        if (!currentRef) {
          return;
        }

        const dataurl = await toPng(currentRef);
        setImgSrc(dataurl);
      };

      generateImage();
    }
  }, [currentRef, isOpen]);

  const copyToClipboard = () => {
    const nativeImg = electron.nativeImage.createFromDataURL(imgSrc);

    electron.clipboard.write({
      image: nativeImg,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent
        minWidth="60vw"
        bgColor="purple.50"
        style={{ borderRadius: 24 }}
        shadow="dark-lg"
      >
        <ModalHeader>Share Left on Read</ModalHeader>
        <ModalCloseButton />
        <ModalBody style={{ width: '60vw' }}>
          <Text>
            Share to your socials{` `}
            <span
              style={{
                fontWeight: 600,
                color: defaultTheme.colors.purple['500'],
              }}
            >
              #LeftOnReadWrapped
            </span>
          </Text>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '48px 64px',
            }}
          >
            <div
              style={{
                height: '50vh',
                width: '100%',
              }}
            >
              {!imgSrc ? (
                <Skeleton height="50vh" width="28.125vh" />
              ) : (
                <Box
                  shadow="dark-lg"
                  style={{
                    height: '50vh',
                    width: '28.125vh',
                    borderRadius: 16,
                  }}
                >
                  <img
                    src={imgSrc}
                    alt="Content"
                    style={{ height: '100%', borderRadius: 16 }}
                  />
                  {/* <Text
                    style={{ margin: '8px 0 16px 0' }}
                    fontSize="sm"
                    fontStyle="italic"
                  >
                    *Low Res Preview
                  </Text> */}
                </Box>
              )}
            </div>
            <div style={{ marginLeft: '36px' }}>
              <Stack spacing="32px">
                <Button
                  leftIcon={<CopyIcon />}
                  onClick={() => {
                    copyToClipboard();
                    setCopied(true);

                    setTimeout(() => {
                      setCopied(false);
                    }, 2500);

                    logEvent({
                      eventName: 'WSM_COPY',
                    });
                  }}
                  shadow="2xl"
                >
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </Button>
                <Button
                  leftIcon={<FiMessageCircle />}
                  colorScheme="messenger"
                  onClick={() => {
                    copyToClipboard();
                    openIMessageAndPasteImage();

                    logEvent({
                      eventName: 'WSM_MESSAGE',
                    });
                  }}
                  shadow="2xl"
                >
                  Share with iMessage
                </Button>
                <Button
                  leftIcon={<FiInstagram />}
                  colorScheme="pink"
                  onClick={() => {
                    copyToClipboard();
                    window.open(
                      'https://instagram.com',
                      '_blank',
                      'top=500,left=200,frame=false,nodeIntegration=no'
                    );
                  }}
                  shadow="2xl"
                >
                  Share to Instagram
                </Button>
                <Button
                  leftIcon={<FiTwitter />}
                  colorScheme="twitter"
                  onClick={() => {
                    copyToClipboard();
                    window.open(
                      'https://twitter.com',
                      '_blank',
                      'top=500,left=200,frame=false,nodeIntegration=no'
                    );

                    logEvent({
                      eventName: 'WSM_TWITTER',
                    });
                  }}
                  shadow="2xl"
                >
                  Share to Twitter
                </Button>
                <Button
                  leftIcon={<FiDownload />}
                  colorScheme="purple"
                  onClick={() => {
                    download(imgSrc, 'leftonread-wrapped.png');

                    logEvent({
                      eventName: 'WSM_DOWNLOAD',
                    });
                  }}
                  shadow="2xl"
                >
                  Download PNG
                </Button>
              </Stack>
            </div>
          </div>
        </ModalBody>
        <Divider />
      </ModalContent>
    </Modal>
  );
}
