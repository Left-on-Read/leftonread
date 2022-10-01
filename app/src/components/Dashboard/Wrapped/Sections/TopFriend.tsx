import { Box, Text, theme as defaultTheme } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import Confetti from 'react-confetti';

import { TimerBar } from '../TimerBar';

const sectionDurationInSecs = 12;

export function TopFriend({
  shouldExit,
  onExitFinish,
}: {
  shouldExit: boolean;
  onExitFinish: () => void;
}) {
  const controls = useAnimationControls();
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const sentMessages = 3847;
  const receivedMessages = 2384;
  const topWord = 'Idiot';

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

  useEffect(() => {
    const interval = setTimeout(() => {
      setShowConfetti(true);
    }, 5500);

    return () => {
      clearTimeout(interval);
    };
  }, []);

  return (
    <Box
      height="100%"
      width="100%"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3vh',
        borderRadius: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
      shadow="dark-lg"
      bgColor="purple.50"
    >
      <TimerBar durationInSecs={sectionDurationInSecs} />
      <Confetti
        run={showConfetti}
        numberOfPieces={500}
        tweenDuration={1000}
        recycle={false}
      />
      <div style={{ height: '10vh' }} />

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={controls}
        style={{
          lineHeight: 1.2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        transition={{
          duration: 0.5,
          delay: 4.4,
        }}
      >
        <Text fontSize="lg" fontWeight="medium" style={{ textAlign: 'center' }}>
          Your Top Friend:
        </Text>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          style={{
            lineHeight: 1.2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          transition={{
            duration: 0.5,
            delay: 5.3,
          }}
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            style={{ textAlign: 'center', marginTop: '1vh' }}
            color="purple.500"
          >
            Alexander Danilowicz
          </Text>
        </motion.div>
      </motion.div>
      <motion.div
        style={{ display: 'flex', flexDirection: 'column', marginTop: '5vh' }}
      >
        <motion.div
          style={{ marginBottom: '1vh' }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.7,
            delay: 0.3,
          }}
        >
          <Text fontSize="lg">
            <span style={{ fontWeight: 600, marginRight: '1vh' }}>
              Total Messages:
            </span>{' '}
            {(sentMessages + receivedMessages).toLocaleString()}
          </Text>
        </motion.div>
        <motion.div
          style={{ marginBottom: '1vh' }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.7,
            delay: 1.3,
          }}
        >
          <Text fontSize="lg">
            <span style={{ fontWeight: 600, marginRight: '1vh' }}>Sent:</span>{' '}
            {sentMessages.toLocaleString()}
          </Text>
        </motion.div>
        <motion.div
          style={{ marginBottom: '1vh' }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.7,
            delay: 2.3,
          }}
        >
          <Text fontSize="lg">
            <span style={{ fontWeight: 600, marginRight: '1vh' }}>
              Received:
            </span>{' '}
            {receivedMessages.toLocaleString()}
          </Text>
        </motion.div>
        <motion.div
          style={{ marginBottom: '1vh' }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.7,
            delay: 3.3,
          }}
        >
          <Text fontSize="lg">
            <span style={{ fontWeight: 600, marginRight: '1vh' }}>
              Top Word:
            </span>{' '}
            {topWord}
          </Text>
        </motion.div>
      </motion.div>
    </Box>
  );
}
