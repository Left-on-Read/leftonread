import { Box, Text } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useEffect } from 'react';

import LogoWithText from '../../../../../assets/LogoWithText.svg';
import { useGlobalContext } from '../../GlobalContext';

export function WrappedIntro({
  startDate,
  shouldExit,
  onExitFinish,
}: {
  startDate: Date;
  shouldExit: boolean;
  onExitFinish: () => void;
}) {
  const globalData = useGlobalContext();
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
      <motion.div animate={controls} transition={{ duration: 1, delay: 0.4 }}>
        <div style={{ padding: '36px', marginTop: '-90px' }}>
          <img
            src={LogoWithText}
            alt="Left on Read"
            style={{ height: '100%' }}
          />
        </div>
      </motion.div>
      <motion.div animate={controls} transition={{ duration: 1 }}>
        <Text
          fontSize="5xl"
          fontWeight={600}
          bgGradient="linear(to-r, blue.400, purple.600)"
          bgClip="text"
        >
          Wrapped
        </Text>
      </motion.div>
      <motion.div animate={controls} transition={{ duration: 1, delay: 0.2 }}>
        <Text color="gray.700">
          {startDate.toLocaleDateString()} -{' '}
          {globalData.dateRange.latestDate.toLocaleDateString()}
        </Text>
      </motion.div>
    </Box>
  );
}
