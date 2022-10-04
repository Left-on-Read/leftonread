import { Box, Text, theme as defaultTheme } from '@chakra-ui/react';
import { MostPopularDayResult } from 'analysis/queries/WrappedQueries/MostPopularDayQuery';
import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

import { AnimationRunner } from '../AnimationRunner';
import { ShareIndicator } from '../ShareIndicator';
import { TimerBar } from '../TimerBar';
import { Watermark } from '../Watermark';

const sectionDurationInSecs = 10;

export function BusiestDay({
  shouldExit,
  onExitFinish,
  mostPopularDayData,
}: {
  mostPopularDayData: MostPopularDayResult;
  shouldExit: boolean;
  onExitFinish: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [tick, setTick] = useState<number>(0);

  const ar = useMemo(
    () => new AnimationRunner(sectionDurationInSecs, setTick),
    []
  );

  const controls = useAnimationControls();

  const totalTexts = mostPopularDayData.mostPopularCount;
  const averageTexts = mostPopularDayData.avgCount;

  useEffect(() => {
    ar.addEvent(200, () => {
      controls.start({
        opacity: 1,
      });
    });

    ar.addEvent((sectionDurationInSecs - 1) * 1000, () => {
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
        loggingContext="BusiestDay"
      />
      <Box
        height="100%"
        width="100%"
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '8vh 5vh',
        }}
        bgColor="purple.50"
      >
        <Watermark />
        <motion.div
          // initial={{
          //   opacity: 0, // NOTE(Danilowicz): this ruins the share if it's left there
          // }}
          animate={controls}
          style={{
            lineHeight: 1.2,
            display: 'flex',
            justifyContent: 'center',
            marginTop: '6vh',
          }}
        >
          <Text fontSize="xl" style={{ textAlign: 'center', lineHeight: 1.4 }}>
            On{' '}
            <span
              style={{
                fontWeight: 'bold',
                color: defaultTheme.colors.purple['500'],
              }}
            >
              {mostPopularDayData.mostPopularDate.toLocaleDateString('en-us', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            , you sent and received a total of{' '}
            <span
              style={{
                fontWeight: 'bold',
                color: defaultTheme.colors.purple['500'],
              }}
            >
              {totalTexts.toLocaleString()}
            </span>{' '}
            messages
          </Text>
        </motion.div>
        <div
          style={{
            height: '80%',
            width: '100%',
            justifySelf: 'flex-end',
            position: 'relative',
            marginBottom: '2vh',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <div
              style={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column-reverse',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Text style={{ marginTop: '1vh' }} fontWeight="semibold">
                {mostPopularDayData.mostPopularDate.toLocaleDateString()}
              </Text>
              <motion.div
                initial={{ height: 0 }}
                animate={{
                  height: `70%`,
                }}
                transition={{
                  duration: 1,
                }}
                style={{
                  width: '7vh',
                }}
              >
                <Box
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: '8px 8px 0 0',
                  }}
                  bgGradient="linear(to-t, blue.400, purple.400)"
                />
              </motion.div>
              <Text>{totalTexts.toLocaleString()}</Text>
            </div>
            <div
              style={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column-reverse',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Text style={{ marginTop: '1vh' }} fontWeight="semibold">
                Average
              </Text>
              <motion.div
                initial={{ height: 0 }}
                animate={{
                  height: `${
                    70 * (averageTexts / (averageTexts + totalTexts))
                  }%`,
                }}
                transition={{
                  duration: 1,
                }}
                style={{
                  width: '7vh',
                }}
              >
                <Box
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: '8px 8px 0 0',
                  }}
                  bgGradient="linear(to-t, blue.400, purple.400)"
                />
              </motion.div>
              <Text>{averageTexts.toLocaleString()}</Text>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
}
