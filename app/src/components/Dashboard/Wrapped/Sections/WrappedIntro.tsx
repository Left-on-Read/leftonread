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
        padding: '36px',
        borderRadius: 16,
        position: 'relative',
      }}
      shadow="dark-lg"
      bgColor="purple.50"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
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
        <motion.div animate={controls} transition={{ duration: 1, delay: 0.2 }}>
          <Text
            fontSize="5xl"
            fontWeight={800}
            bgGradient="linear(to-r, blue.400, purple.600)"
            bgClip="text"
          >
            Wrapped
          </Text>
        </motion.div>
        <motion.div animate={controls} transition={{ duration: 1, delay: 0.4 }}>
          <Text color="gray.700" fontSize="xl" style={{ marginTop: '2vh' }}>
            {startDate.toLocaleDateString()} -{' '}
            {globalData.dateRange.latestDate.toLocaleDateString()}
          </Text>
        </motion.div>
      </motion.div>
    </Box>
  );
}
