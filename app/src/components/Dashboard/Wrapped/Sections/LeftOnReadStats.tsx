import { Box, Text, theme as defaultTheme } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect } from 'react';

import { TimerBar } from '../TimerBar';

const sectionDurationInSecs = 10;

export function LeftOnReadStats({
  shouldExit,
  onExitFinish,
}: {
  shouldExit: boolean;
  onExitFinish: () => void;
}) {
  const sentControls = useAnimationControls();
  const receivedControls = useAnimationControls();

  const animateExit = useCallback(() => {
    sentControls.stop();
    receivedControls.stop();

    sentControls.start({
      x: -20,
      opacity: 0,
      transition: {
        duration: 1,
      },
    });

    receivedControls.start({
      x: 100,
      opacity: 0,
      transition: {
        duration: 1,
      },
    });
  }, [sentControls, receivedControls]);

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
      sentControls.start({
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.5,
        },
      });

      receivedControls.start({
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.5,
          delay: 0.5,
        },
      });
    }, 200);
  }, [sentControls, receivedControls]);

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
        justifyContent: 'space-around',
        padding: '7vh 6vh',
        borderRadius: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
      shadow="dark-lg"
      bgColor="blue.50"
    >
      <TimerBar durationInSecs={sectionDurationInSecs} isBlue />
      <motion.div
        animate={sentControls}
        initial={{
          x: -20,
          opacity: 0,
        }}
      >
        <Text fontSize="xl" fontWeight="bold">
          You got left on read
        </Text>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Text fontSize="6xl" fontWeight="black" color="purple.500">
            487
          </Text>
          <Text style={{ paddingBottom: 20, marginLeft: 8 }}>times</Text>
        </div>
      </motion.div>
      <motion.div
        style={{ alignSelf: 'flex-end' }}
        animate={receivedControls}
        initial={{
          opacity: 0,
          x: 110,
        }}
      >
        <Text fontSize="xl" fontWeight="bold">
          You left others on read
        </Text>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Text fontSize="6xl" fontWeight="black" color="orange.500">
            859
          </Text>
          <Text style={{ paddingBottom: 20, marginLeft: 8 }}>times</Text>
        </div>
      </motion.div>
    </Box>
  );
}
