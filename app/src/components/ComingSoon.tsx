import { Button, Text, useDisclosure } from '@chakra-ui/react';

import Coworkers from '../../assets/illustrations/coworkers.svg';
import { Float } from './Float';
import { EmailModal } from './Support/EmailModal';

export function ComingSoon() {
  const {
    isOpen: isEmailModalOpen,
    onOpen: onEmailModalOpen,
    onClose: onEmailModalClose,
  } = useDisclosure();

  return (
    <div style={{ display: 'flex', padding: 36 }}>
      <Float
        circleShadowDimensions={{
          marginTop: 20,
          width: 120,
        }}
      >
        <img
          src={Coworkers}
          alt="Working hard"
          style={{
            width: '40vw',
            border: '1px solid lightgray',
            borderRadius: '50%',
          }}
        />
      </Float>
      <div style={{ marginLeft: 64, paddingRight: 64 }}>
        <Text fontWeight="bold" fontSize="lg">
          Thanks for your support!
        </Text>
        <Text>
          We have exciting features planned: powerful filtering and support for
          Facebook Messenger 👀
        </Text>
        <div style={{ marginTop: 32 }} />
        <Button
          variant="link"
          colorScheme="purple"
          fontWeight="bold"
          fontSize="md"
          onClick={() => onEmailModalOpen()}
        >
          Have ideas? Submit them here! - ❤️ Teddy & Alex
        </Button>
      </div>
      <EmailModal isOpen={isEmailModalOpen} onClose={onEmailModalClose} />
    </div>
  );
}
