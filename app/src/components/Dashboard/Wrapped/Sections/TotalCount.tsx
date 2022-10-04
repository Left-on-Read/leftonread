import { Box, Text, theme as defaultTheme } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AnimationRunner } from '../AnimationRunner';
import { ShareIndicator } from '../ShareIndicator';
import { TimerBar } from '../TimerBar';
import { Watermark } from '../Watermark';

// TODO(teddy): Revert this once timing gets upgraded
const sectionDurationInSecs = 8;

export function TotalCount({
  data,
  shouldExit,
  onExitFinish,
}: {
  data: { sent: number; received: number };
  shouldExit: boolean;
  onExitFinish: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [tick, setTick] = useState<number>(0);

  const ar = useMemo(
    () => new AnimationRunner(sectionDurationInSecs, setTick),
    []
  );

  const sentControls = useAnimationControls();
  const receivedControls = useAnimationControls();

  useEffect(() => {
    ar.addEvent(200, () => {
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
    });

    ar.addEvent((sectionDurationInSecs - 1) * 1000, () => {
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
    });

    ar.addEvent(sectionDurationInSecs * 1000, onExitFinish);

    ar.start();

    return () => {
      ar.reset();
      ar.isActive = false;
    };
  }, [ar, sentControls, receivedControls, onExitFinish]);

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
      <TimerBar durationInSecs={sectionDurationInSecs} tick={tick} />
      <ShareIndicator
        contentRef={ref}
        onPause={() => {
          ar.pause();
        }}
        onStart={() => {
          ar.start();
        }}
        loggingContext="TotalCount"
      />
      <Box
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          height: '100%',
          width: '100%',
          padding: '7vh 6vh',
          position: 'relative',
        }}
        bgColor="purple.50"
      >
        <Watermark />
        <motion.div animate={sentControls} initial={{ opacity: 0 }}>
          <Text fontSize="4xl" fontWeight="bold" color="blue.600">
            Sent
          </Text>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Text fontSize="6xl" fontWeight="bold" color="blue.500">
              {data.sent.toLocaleString()}
            </Text>
            <Text
              fontWeight="bold"
              style={{ paddingBottom: 20, marginLeft: 8 }}
            >
              texts
            </Text>
          </div>
        </motion.div>
        <motion.div
          style={{ alignSelf: 'flex-end' }}
          animate={receivedControls}
          initial={{ opacity: 0 }}
        >
          <Text fontSize="4xl" fontWeight="bold" color="green.600">
            Received
          </Text>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Text fontSize="6xl" fontWeight="bold" color="green.500">
              {data.received.toLocaleString()}
            </Text>
            <Text
              fontWeight="bold"
              style={{ paddingBottom: 20, marginLeft: 8 }}
            >
              texts
            </Text>
          </div>
        </motion.div>
      </Box>
    </Box>
  );
}
