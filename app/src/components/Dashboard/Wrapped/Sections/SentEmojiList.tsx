import { Box, Stack, Text, theme as defaultTheme } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect } from 'react';

import { TimerBar } from '../TimerBar';

const sectionDurationInSecs = 10;

export function SentEmojiList({
  shouldExit,
  onExitFinish,
}: {
  shouldExit: boolean;
  onExitFinish: () => void;
}) {
  const emojis = ['🥶', '😋', '🎃', '😑', '🤓'];

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
    }, (sectionDurationInSecs - 2.3) * 1000);

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
        padding: '6vh 4vh',
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
        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
          Your Top Sent Emojis
        </Text>
      </motion.div>
      <Stack style={{ marginTop: '6vh' }} spacing="4vh">
        {emojis.map((emoji, index) => (
          <Box key={emoji} style={{ display: 'flex', alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={controls}
              transition={{
                duration: 0.4,
                delay: 0.2 + 0.1 * index,
              }}
            >
              <Text fontSize="4xl" fontWeight="bold" style={{ width: '12vh' }}>
                #{index + 1}
              </Text>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={controls}
              transition={{
                duration: 0.4,
                delay: 0.8 + 0.2 * index,
              }}
            >
              <Text fontSize="3xl" fontWeight="semibold">
                {emoji}
              </Text>
            </motion.div>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}