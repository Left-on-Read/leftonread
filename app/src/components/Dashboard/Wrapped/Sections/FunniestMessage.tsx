import { Box, Text, theme as defaultTheme } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect } from 'react';

import { TimerBar } from '../TimerBar';

const sectionDurationInSecs = 10;

export function FunniestMessage({
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
        padding: '5vh 4vh',
        borderRadius: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
      shadow="dark-lg"
      bgColor="blue.50"
    >
      <TimerBar durationInSecs={sectionDurationInSecs} isBlue />
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={controls}
        style={{ lineHeight: 1.2 }}
      >
        <Text fontSize="2xl" fontWeight="bold">
          Funniest Message
        </Text>
        <Text fontSize="md">in SF North Park Boys</Text>
      </motion.div>
      <motion.div style={{ marginTop: '15vh' }}>
        <span style={{ fontWeight: 600 }}>8{` `}</span> Laugh Reactions
      </motion.div>
      <motion.div
        style={{
          backgroundColor: defaultTheme.colors.blue['500'],
          width: '100%',
          padding: '2vh',
          color: 'white',
          borderRadius: 16,
          marginTop: 16,
          fontWeight: 400,
        }}
      >
        One day we will understand what it means to be a true investor
      </motion.div>
      <motion.div style={{ alignSelf: 'flex-end', marginTop: '2vh' }}>
        From <span style={{ fontWeight: 600 }}>Jackie Chen</span>
      </motion.div>
    </Box>
  );
}
