import { Box, Stack, Text, theme as defaultTheme } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { TWordOrEmojiResults } from '../../../../analysis/queries/WordOrEmojiQuery';
import { AnimationRunner } from '../AnimationRunner';
import { ShareIndicator } from '../ShareIndicator';
import { TimerBar } from '../TimerBar';
import { Watermark } from '../Watermark';

const sectionDurationInSecs = 10;

export function SentEmojiList({
  shouldExit,
  onExitFinish,
  topSentEmojis,
}: {
  shouldExit: boolean;
  onExitFinish: () => void;
  topSentEmojis: TWordOrEmojiResults;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [tick, setTick] = useState<number>(0);

  const ar = useMemo(
    () => new AnimationRunner(sectionDurationInSecs, setTick),
    []
  );

  const controls = useAnimationControls();
  const shareControls = useAnimationControls();

  useEffect(() => {
    ar.addEvent(200, () => {
      controls.start({
        opacity: 1,
      });

      shareControls.start({
        opacity: 1,
        transition: {
          delay: 2,
        },
      });
    });

    ar.addEvent((sectionDurationInSecs - 2.5) * 1000, () => {
      controls.stop();

      shareControls.start({
        opacity: 0,
      });

      controls.start({
        opacity: 0,
      });
    });

    ar.addEvent(sectionDurationInSecs * 1000, onExitFinish);

    ar.start();

    return () => {
      ar.reset();
      ar.isActive = false;
    };
  }, [ar, controls, shareControls, onExitFinish]);

  return (
    <Box
      height="100%"
      width="100%"
      style={{
        borderRadius: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
      shadow="dark-lg"
      bgColor="blue.50"
    >
      <TimerBar durationInSecs={sectionDurationInSecs} isBlue tick={tick} />
      <motion.div initial={{ opacity: 0 }} animate={shareControls}>
        <ShareIndicator
          contentRef={ref}
          onPause={() => {
            ar.pause();
          }}
          onStart={() => {
            ar.start();
          }}
          loggingContext="SentEmojiList"
        />
      </motion.div>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '6vh 4vh',
        }}
        height="100%"
        width="100%"
        bgColor="blue.50"
        ref={ref}
      >
        <Watermark />
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={controls}
          style={{ lineHeight: 1.2, marginTop: '8vh' }}
        >
          <Text fontSize="2xl" fontWeight="bold" color="blue.600">
            Your Top Sent Emojis
          </Text>
        </motion.div>
        <Stack style={{ marginTop: '3vh' }} spacing="4vh">
          {topSentEmojis.map((emoji, index) => (
            <Box
              key={emoji.word}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={controls}
                transition={{
                  duration: 0.4,
                  delay: 0.2 + 0.1 * index,
                }}
              >
                <Text
                  fontSize="4xl"
                  fontWeight="bold"
                  style={{ width: '12vh' }}
                  color="blue.600"
                >
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
                <Text fontSize="4xl" fontWeight="semibold">
                  {emoji.word}
                </Text>
              </motion.div>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
