import { Box, Spinner, Text } from '@chakra-ui/react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';

import LogoWithText from '../../../../../assets/LogoWithText.svg';

export function WrappedLoading() {
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
            padding: '36px',
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
            <Text
              fontSize="2xl"
              fontWeight={800}
              bgGradient="linear(to-r, blue.400, purple.600)"
              bgClip="text"
            >
              Wrapping your year...
            </Text>
          </motion.div>
          <motion.div
            animate={controls}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <Spinner
              color="purple.700"
              size="lg"
              style={{ marginTop: '4vh' }}
            />
          </motion.div>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}
