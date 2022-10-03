import { Box, Text, theme as defaultTheme } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect } from 'react';

import { ShareIndicator } from '../ShareIndicator';
import { TimerBar } from '../TimerBar';

const sectionDurationInSecs = 10000000;

export function TotalCount({
  data,
  shouldExit,
  onExitFinish,
}: {
  data: { sent: number; received: number };
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
      x: 20,
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
        x: 20,
        transition: {
          duration: 0.5,
        },
      });

      receivedControls.start({
        opacity: 1,
        x: -20,
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
      bgColor="purple.50"
    >
      <TimerBar durationInSecs={sectionDurationInSecs} />
      <ShareIndicator />
      <motion.div animate={sentControls} initial={{ opacity: 0 }}>
        <Text fontSize="4xl" fontWeight="bold">
          Sent
        </Text>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Text fontSize="6xl" fontWeight="black" color="blue.500">
            {data.sent.toLocaleString()}
          </Text>
          <Text style={{ paddingBottom: 20, marginLeft: 8 }}>texts</Text>
        </div>
      </motion.div>
      <motion.div
        style={{ alignSelf: 'flex-end' }}
        animate={receivedControls}
        initial={{ opacity: 0 }}
      >
        <Text fontSize="4xl" fontWeight="bold">
          Received
        </Text>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Text fontSize="6xl" fontWeight="black" color="green.500">
            {data.received.toLocaleString()}
          </Text>
          <Text style={{ paddingBottom: 20, marginLeft: 8 }}>texts</Text>
        </div>
      </motion.div>
    </Box>
  );
}
