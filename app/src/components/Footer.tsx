import { Button, Text, useDisclosure } from '@chakra-ui/react';

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
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <Text color="gray.400" fontSize={12}>
          Left on Read {APP_VERSION}
        </Text>
        <Button
          color="gray.400"
          fontSize={12}
          onClick={() => {
            onEmailModalOpen();
          }}
          variant="link"
        >
          Contact Us
        </Button>
      </div>
      <EmailModal isOpen={isEmailModalOpen} onClose={onEmailModalClose} />
    </>
  );
}
