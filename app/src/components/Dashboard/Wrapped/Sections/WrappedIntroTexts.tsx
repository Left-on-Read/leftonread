import { Box, theme as defaultTheme } from '@chakra-ui/react';
import { animate, motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import ChatBubble1 from '../../../../../assets/chat_bubble_1.svg';
import ChatBubble2 from '../../../../../assets/chat_bubble_2.svg';

const sectionDurationInSecs = 8;

export function WrappedIntroTexts({
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
      y: '-8vh',
      transition: { duration: 1 },
    });
  }, [controls]);

  useEffect(() => {
    const timeoutOne = setTimeout(() => {
      animateExit();
    }, (sectionDurationInSecs - 1.5) * 1000);

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
        y: '-8vh',
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
        padding: '36px',
        position: 'relative',
        borderRadius: 16,
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
      <div style={{ height: '10vh' }} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={controls}
        transition={{ duration: 1 }}
        style={{ alignSelf: 'flex-end', width: '90%' }}
      >
        <img src={ChatBubble1} alt="Left on Read" style={{ width: '100%' }} />
      </motion.div>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={controls}
        transition={{ duration: 1, delay: 2 }}
        style={{ marginTop: '6vh', width: '90%' }}
      >
        <img src={ChatBubble2} alt="Left on Read" style={{ width: '100%' }} />
      </motion.div>
    </Box>
  );
}
