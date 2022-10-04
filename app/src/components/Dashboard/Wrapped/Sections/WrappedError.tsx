import { Box, Button, Spinner, Text } from '@chakra-ui/react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { FiRefreshCcw } from 'react-icons/fi';

import LogoWithText from '../../../../../assets/LogoWithText.svg';

export function WrappedError({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  const controls = useAnimationControls();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <Box
          height="100%"
          width="100%"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            borderRadius: 16,
            position: 'relative',
          }}
          shadow="dark-lg"
          bgColor="purple.50"
        >
          <motion.div animate={controls} transition={{ duration: 1 }}>
            <div style={{ padding: '36px', marginTop: '-1vh' }}>
              <img
                src={LogoWithText}
                alt="Left on Read"
                style={{ height: '100%' }}
              />
            </div>
          </motion.div>
          <motion.div
            animate={controls}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <Text fontSize="lg" fontWeight={600} color="red.400">
              Oops! Something went wrong...
            </Text>
          </motion.div>
          <div style={{ textAlign: 'center' }}>
            If this issue persists, please contact support.
          </div>
          <motion.div
            animate={controls}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ marginTop: '3vh', fontSize: '14px' }}
          >
            Error Code: {error}
          </motion.div>
          <Box style={{ marginTop: '8vh' }}>
            <Button
              onClick={() => onRetry()}
              colorScheme="purple"
              leftIcon={<FiRefreshCcw />}
            >
              Retry
            </Button>
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}
