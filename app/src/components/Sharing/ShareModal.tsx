import {
  Button,
  Divider,
  Modal,
  ModalBody,
  // ModalCloseButton,
  ModalContent,
  // ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import electron from 'electron';
import { useEffect, useState } from 'react';

import { logEvent } from '../../utils/analytics';

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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
              }}
            >
              <Text color="gray.800"> Share this graph</Text>
            </div>
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
                {copied ? <>Copied!</> : <>Copy image to clipboard</>}
              </span>
            </Button>
          </div>
          <Divider style={{ marginBottom: '10px' }} />
        </ModalHeader>
        {/* <ModalCloseButton /> */}
        <ModalBody>
          {children}
          {/* <Bar data={data} ref={chartRef} /> */}
          {/* {isSuccess ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Icon as={FiSmile} />
              <div>
                <Text>Thanks for sharing!</Text>
              </div>
            </div>
          ) : (
            <div>
              {`Share this graph with your friends over iMessage. The image has
              already been copy pasted to your clipbboard.
              Or, send it automatically to [dropdown].`}
            </div>
          )} */}
        </ModalBody>

        {/* <ModalFooter>
          {!isSuccess && (
            <Button
              colorScheme="purple"
              onClick={() => console.log('hi')}
              style={{ marginRight: 16 }}
              leftIcon={<Icon as={FiSend} />}
              isLoading={isSending}
            >
              Share with Teddy Ni
            </Button>
          )}
          <Button onClick={onClose}>{isSuccess ? 'Close' : 'Cancel'}</Button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
}
