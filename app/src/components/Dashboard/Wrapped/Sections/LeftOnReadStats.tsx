import { Box, Text, theme as defaultTheme } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { EngagementResult } from '../../../../analysis/queries/EngagementQueries';
import { AnimationRunner } from '../AnimationRunner';
import { ShareIndicator } from '../ShareIndicator';
import { TimerBar } from '../TimerBar';
import { Watermark } from '../Watermark';

const sectionDurationInSecs = 10;

export function LeftOnReadStats({
  shouldExit,
  onExitFinish,
  leftOnReadData,
}: {
  shouldExit: boolean;
  onExitFinish: () => void;
  leftOnReadData: EngagementResult[];
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
      bgColor="blue.50"
    >
      <TimerBar durationInSecs={sectionDurationInSecs} isBlue tick={tick} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1.5,
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
          loggingContext="LeftOnReadStats"
        />
      </motion.div>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          padding: '7vh 6vh',
        }}
        ref={ref}
        height="100%"
        width="100%"
        bgColor="blue.50"
      >
        <Watermark />
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
              {leftOnReadData.find((c) => c.isFromMe === 0)?.value ?? 0}
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
            <Text fontSize="6xl" fontWeight="black" color="pink.500">
              {leftOnReadData.find((c) => c.isFromMe === 1)?.value ?? 0}
            </Text>
            <Text style={{ paddingBottom: 20, marginLeft: 8 }}>times</Text>
          </div>
        </motion.div>
      </Box>
    </Box>
  );
}
