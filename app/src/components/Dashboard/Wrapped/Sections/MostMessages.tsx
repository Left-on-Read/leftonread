import { Box, Text, theme as defaultTheme } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect } from 'react';

import { TimerBar } from '../TimerBar';

const sectionDurationInSecs = 8;

export function MostMessages({
  shouldExit,
  onExitFinish,
}: {
  shouldExit: boolean;
  onExitFinish: () => void;
}) {
  const controls = useAnimationControls();

  const secondFriend = 'Sally Xu';
  const thirdFriend = 'Alex Chan';
  const fourthFriend = 'Brian Mc Gartoll';
  const fitfhFriend = 'Matthew Tso';

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
      <TimerBar durationInSecs={sectionDurationInSecs} />
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={controls}
        style={{ lineHeight: 1.2, display: 'flex', justifyContent: 'center' }}
      >
        <Text fontSize="3xl" fontWeight="bold" style={{ textAlign: 'center' }}>
          Most of these messages seem to be going to a select few friends
        </Text>
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          bottom: '4vh',
          left: '2vh',
          fontWeight: 'bold',
          color: 'gray',
          fontSize: 36,
        }}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 2.5,
          delay: 2,
        }}
      >
        {secondFriend}
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          bottom: '15vh',
          right: '5vh',
          fontWeight: 'bold',
          color: 'gray',
          opacity: 0.4,
          fontSize: 36,
        }}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 2.5,
          delay: 3,
        }}
      >
        {thirdFriend}
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          top: '13vh',
          right: '-8vh',
          fontWeight: 'bold',
          color: 'gray',
          opacity: 0.4,
          fontSize: 36,
        }}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 2.5,
          delay: 2.5,
        }}
      >
        {fourthFriend}
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          top: '5vh',
          left: '-8vh',
          fontWeight: 'bold',
          color: 'gray',
          opacity: 0.4,
          fontSize: 36,
        }}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 2.5,
          delay: 3.5,
        }}
      >
        {fitfhFriend}
      </motion.div>
    </Box>
  );
}
