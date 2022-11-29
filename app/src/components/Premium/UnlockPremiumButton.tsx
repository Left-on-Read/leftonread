import { Box, Button, Text, useDisclosure } from '@chakra-ui/react';
import { FiUnlock } from 'react-icons/fi';

import { logEvent } from '../../utils/analytics';
import { STRIPE_LINK } from './constants';
import { PremiumModal } from './PremiumModal';

export function UnlockPremiumButton({
  context,
  altText,
}: {
  context: string;
  altText?: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box shadow="2xl">
        <Button
          bgGradient="linear(to-br, yellow.400, yellow.600)"
          colorScheme="yellow"
          onClick={() => {
            logEvent({
              eventName: 'UNLOCK_GOLD',
              properties: {
                context,
              },
            });
            window.open(STRIPE_LINK);
            onOpen();
          }}
          color="white"
          fontWeight="medium"
          size="lg"
          paddingTop={10}
          paddingBottom={10}
          style={{
            width: '100%',
          }}
        >
          <Box>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FiUnlock />
              <Text fontWeight={600} ml={3}>
                Unlock Gold
              </Text>
            </Box>
            <Text fontSize="14">
              {altText ??
                'Get access to everything by supporting this project.'}
            </Text>
          </Box>
        </Button>
      </Box>
      <PremiumModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
