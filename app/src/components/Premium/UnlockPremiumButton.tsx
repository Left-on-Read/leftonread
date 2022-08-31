import { Box, Button, Icon, useDisclosure } from '@chakra-ui/react';
import { FiLock } from 'react-icons/fi';

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
            window.open(
              'https://checkout.stripe.com/pay/cs_live_b1DBvSe1jfp8QHlIDbn6OO4J2J86GcwsH7qS5w9TFRasiTMKaVAoFrd5jl#fidkdWxOYHwnPyd1blppbHNgWjA0SVNMdHJGSkZzMGJ0YmQ2S2ZvS0lRVFF1TH10RlFoSms2UktObDJfSV9RNWowTGxrN2dKXVdVXHRMbDA1UU9Wazwwf39VYmpuN2hMU2R1fENcSnB8Nkg2NTVXVFc8YG8ydicpJ3VpbGtuQH11anZgYUxhJz8nM2pAZExCPW9DNlROPXdWZ0xOJ3gl'
            );
            onOpen();
          }}
          color="white"
          fontWeight="medium"
          size="lg"
        >
          Unlock Premium
        </Button>
      </Box>
      <PremiumModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
