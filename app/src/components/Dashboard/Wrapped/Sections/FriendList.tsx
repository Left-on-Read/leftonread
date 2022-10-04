import { Box, Stack, Text, theme as defaultTheme } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { TopFriendsSimpleResult } from '../../../../analysis/queries/WrappedQueries/TopFriendsSimpleQuery';
import { AnimationRunner } from '../AnimationRunner';
import { ShareIndicator } from '../ShareIndicator';
import { TimerBar } from '../TimerBar';
import { Watermark } from '../Watermark';

const sectionDurationInSecs = 10;

export function FriendList({
  shouldExit,
  onExitFinish,
  topFriends,
}: {
  shouldExit: boolean;
  onExitFinish: () => void;
  topFriends: TopFriendsSimpleResult;
}) {
  const data = topFriends.map((c) => c.friend);

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
          loggingContext="FriendList"
        />
      </motion.div>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '6vh 4vh',
        }}
        bgColor="blue.50"
        height="100%"
        width="100%"
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
            Your Top Friends
          </Text>
        </motion.div>
        <Stack style={{ marginTop: '3vh' }} spacing="4vh">
          {data.slice(0, 5).map((friend, index) => (
            <Box key={friend} style={{ display: 'flex', alignItems: 'center' }}>
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
                  style={{ width: '9vh' }}
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
                <Text fontSize="2xl" fontWeight="semibold">
                  {friend}
                </Text>
              </motion.div>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
