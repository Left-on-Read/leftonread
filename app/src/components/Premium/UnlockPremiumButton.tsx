import { Box, Button, Icon, useDisclosure } from '@chakra-ui/react';
import { FiLock } from 'react-icons/fi';

import { PremiumModal } from './PremiumModal';

const STRIPE_LINK = 'https://buy.stripe.com/6oEaIG8jF3QK8rSbIK';

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
