import { Button, Text, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import FixingBugs from '../../../assets/illustrations/fixing_bugs.svg';
import { Float } from '../Float';
import { EmailModal } from './EmailModal';

export function ErrorPage({
  onClearError,
  onRefresh,
}: {
  onClearError: () => void;
  onRefresh: () => void;
}) {
  const {
    isOpen: isEmailModalOpen,
    onOpen: onEmailModalOpen,
    onClose: onEmailModalClose,
  } = useDisclosure();

  const navigate = useNavigate();

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <div
        style={{
          width: '40%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Float>
          <img src={FixingBugs} alt="Fixing Bugs" />
        </Float>
      </div>
      <div
        style={{
          width: '60%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ padding: 32 }}>
          <Text fontSize="4xl">
            Oops! <Text fontSize="md">Sorry, something went wrong.</Text>
          </Text>
          <div
            style={{ marginTop: 16, display: 'flex', flexDirection: 'column' }}
          >
            <Button
              colorScheme="purple"
              style={{ marginBottom: 12 }}
              onClick={() => onEmailModalOpen()}
            >
              Report Bug
            </Button>
            <Button
              colorScheme="red"
              style={{ marginBottom: 12 }}
              onClick={() => onRefresh()}
            >
              Reset Left on Read
            </Button>
            <Button
              variant="link"
              onClick={() => {
                onClearError();
                navigate('/');
              }}
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={onEmailModalClose}
        defaultReason="support"
      />
    </div>
  );
}
