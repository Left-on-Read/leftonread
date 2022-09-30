import { Box, Text } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useEffect } from 'react';

import LogoWithText from '../../../../../assets/LogoWithText.svg';

export function WrappedIntro({
  shouldExit,
  onExitFinish,
}: {
  shouldExit: boolean;
  onExitFinish: () => void;
}) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (shouldExit) {
      controls.start({
        y: '-8vh',
        opacity: 0,
      });

      setTimeout(() => {
        onExitFinish();
      }, 1400);
    }
  }, [controls, shouldExit, onExitFinish]);

  return (
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
      }}
      shadow="dark-lg"
      bgColor="purple.50"
    >
      <div style={{ height: '10vh' }} />
      <motion.div animate={controls} transition={{ duration: 1 }}>
        <Text fontSize="5xl" fontWeight="bold" color="black">
          Wrapped
        </Text>
      </motion.div>
      <motion.div animate={controls} transition={{ duration: 1, delay: 0.2 }}>
        <Text>Sep 27, 2021 — Sep 27, 2022</Text>
      </motion.div>
      <motion.div animate={controls} transition={{ duration: 1, delay: 0.4 }}>
        <div style={{ marginTop: '4vh', padding: '36px' }}>
          <img
            src={LogoWithText}
            alt="Left on Read"
            style={{ height: '100%' }}
          />
        </div>
      </motion.div>
    </Box>
  );
}
