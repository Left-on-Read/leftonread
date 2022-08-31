import { Box, Button, Icon, useDisclosure } from '@chakra-ui/react';
import { FiLock } from 'react-icons/fi';

import { logEvent } from '../../utils/analytics';
import { STRIPE_LINK } from './constants';
import { PremiumModal } from './PremiumModal';

export function UnlockPremiumButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box shadow="2xl">
        <Button
          leftIcon={<Icon as={FiLock} />}
          bgGradient="linear(to-br, yellow.400, yellow.600)"
          colorScheme="yellow"
          onClick={() => {
            logEvent({
              eventName: 'UNLOCK_GOLD',
            });
            window.open(STRIPE_LINK);
            onOpen();
          }}
          color="white"
          fontWeight="medium"
          size="lg"
        >
          Unlock Gold
        </Button>
      </Box>
      <PremiumModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
