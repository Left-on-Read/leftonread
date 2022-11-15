import { Button, useDisclosure } from '@chakra-ui/react';

import { APP_VERSION } from '../constants/versions';
import { EmailModal } from './Support/EmailModal';

export function Footer() {
  const {
    isOpen: isEmailModalOpen,
    onOpen: onEmailModalOpen,
    onClose: onEmailModalClose,
  } = useDisclosure();

  return (
    <>
      <div
        style={{
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <Button
          color="gray.400"
          fontSize={14}
          onClick={() => {
            window.open(
              'https://github.com/Left-on-Read/leftonread',
              '_blank',
              'top=500,left=200,frame=false,nodeIntegration=no'
            );
          }}
          variant="link"
        >
          Left on Read {APP_VERSION}
        </Button>

        <Button
          color="gray.400"
          fontSize={14}
          onClick={() => {
            window.open(
              'https://www.buymeacoffee.com/leftonread',
              '_blank',
              'top=500,left=200,frame=false,nodeIntegration=no'
            );
          }}
          variant="link"
        >
          ☕ Buy us a coffee
        </Button>

        <Button
          color="gray.400"
          fontSize={14}
          onClick={() => {
            onEmailModalOpen();
          }}
          variant="link"
        >
          Contact Support
        </Button>
      </div>
      <EmailModal isOpen={isEmailModalOpen} onClose={onEmailModalClose} />
    </>
  );
}
