import { Box, Text, theme as defaultTheme } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect } from 'react';

import { Messages } from '../Messages';

const sectionDurationInSecs = 6;

export function DayInParticular({
  shouldExit,
  onExitFinish,
}: {
  shouldExit: boolean;
  onExitFinish: () => void;
}) {
  const controls = useAnimationControls();

  const animateExit = useCallback(() => {
    controls.stop();
    controls.start({
      opacity: 0,
    });
  }, [controls]);

  useEffect(() => {
    const timeoutOne = setTimeout(() => {
      animateExit();
    }, (sectionDurationInSecs - 1) * 1000);

    const timeoutTwo = setTimeout(() => {
      onExitFinish();
    }, sectionDurationInSecs * 1000);

    return () => {
      clearTimeout(timeoutOne);
      clearTimeout(timeoutTwo);
    };
  }, [animateExit, onExitFinish]);

  useEffect(() => {
    setTimeout(() => {
      controls.start({
        opacity: 1,
      });
    }, 200);
  }, [controls]);

  useEffect(() => {
    if (shouldExit) {
      animateExit();
    }
  }, [animateExit, shouldExit]);

  return (
    <Box
      height="100%"
      width="100%"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5vh',
        borderRadius: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
      shadow="dark-lg"
      bgColor="purple.50"
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 5,
          backgroundColor: defaultTheme.colors.purple['500'],
          zIndex: 3,
        }}
        initial={{
          width: '0',
        }}
        animate={{
          width: '100%',
        }}
        transition={{
          duration: sectionDurationInSecs,
        }}
      />
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={controls}
        style={{
          lineHeight: 1.2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Text
          fontSize="3xl"
          fontWeight="bold"
          style={{
            textAlign: 'center',
            zIndex: 2,
          }}
        >
          One day in particular was busier than the others.
        </Text>
        <Box
          style={{
            zIndex: 1,
            marginTop: '10px',
            position: 'absolute',
            width: '80%',
            opacity: '0.5',
          }}
        >
          <Messages />
        </Box>
      </motion.div>
    </Box>
  );
}
