import { Box, Text, theme as defaultTheme } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Confetti from 'react-confetti';

import { TopFriendCountAndWordSimpleResult } from '../../../../analysis/queries/WrappedQueries/TopFriendsSimpleQuery';
import { AnimationRunner } from '../AnimationRunner';
import { ShareIndicator } from '../ShareIndicator';
import { TimerBar } from '../TimerBar';
import { Watermark } from '../Watermark';

const sectionDurationInSecs = 12;

export function TopFriend({
  shouldExit,
  onExitFinish,
  topFriendWordAndCount,
}: {
  shouldExit: boolean;
  onExitFinish: () => void;
  topFriendWordAndCount: TopFriendCountAndWordSimpleResult;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [tick, setTick] = useState<number>(0);

  const ar = useMemo(
    () => new AnimationRunner(sectionDurationInSecs, setTick),
    []
  );
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const controls = useAnimationControls();

  const { friend, sentTotal, receivedTotal, word } = topFriendWordAndCount;

  useEffect(() => {
    ar.addEvent(200, () => {
      controls.start({
        opacity: 1,
      });
    });

    ar.addEvent(5500, () => {
      setShowConfetti(true);
    });

    ar.addEvent((sectionDurationInSecs - 1.1) * 1000, () => {
      controls.start({
        height: '100%',
        transition: {
          duration: 1,
        },
      });
    });

    ar.addEvent(sectionDurationInSecs * 1000, onExitFinish);

    ar.start();

    return () => {
      ar.reset();
      ar.isActive = false;
    };
  }, [ar, controls, onExitFinish]);

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
      bgColor="purple.50"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 6,
        }}
      >
        <ShareIndicator
          contentRef={ref}
          onPause={() => {
            ar.pause();
          }}
          onStart={() => {
            ar.start();
          }}
          loggingContext="TopFriend"
        />
      </motion.div>
      <TimerBar durationInSecs={sectionDurationInSecs} tick={tick} />
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3vh',
        }}
        ref={ref}
        bg="purple.50"
        height="100%"
        width="100%"
      >
        <Watermark />
        <motion.div
          animate={controls}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: defaultTheme.colors.blue['50'],
            zIndex: 10,
          }}
          initial={{
            height: '0%',
          }}
        />
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
            delay: 4.4,
          }}
        >
          <Text mb={10} fontSize="4xl">
            🎉
          </Text>
          <Text
            fontSize="2xl"
            fontWeight="medium"
            style={{ textAlign: 'center' }}
          >
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
              delay: 5.5,
            }}
          >
            <Text
              fontSize="3xl"
              fontWeight="bold"
              style={{ textAlign: 'center', marginTop: '1vh' }}
              color="purple.600"
            >
              {friend}
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
            <Text fontSize="2xl">
              <span style={{ fontWeight: 600, marginRight: '1vh' }}>
                Total Messages:
              </span>{' '}
              {(sentTotal + receivedTotal).toLocaleString()}
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
            <Text fontSize="2xl">
              <span style={{ fontWeight: 600, marginRight: '1vh' }}>Sent:</span>{' '}
              {sentTotal.toLocaleString()}
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
            <Text fontSize="2xl">
              <span style={{ fontWeight: 600, marginRight: '1vh' }}>
                Received:
              </span>{' '}
              {receivedTotal.toLocaleString()}
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
            <Text fontSize="2xl">
              <span style={{ fontWeight: 600, marginRight: '1vh' }}>
                Top Word:
              </span>{' '}
              {word}
            </Text>
          </motion.div>
        </motion.div>
      </Box>
    </Box>
  );
}
