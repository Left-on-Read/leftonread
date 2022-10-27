import { Box, Text, theme as defaultTheme } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FunniestMessageResult } from '../../../../analysis/queries/WrappedQueries/FunniestMessageQuery';
import { AnimationRunner } from '../AnimationRunner';
import { ShareIndicator } from '../ShareIndicator';
import { TimerBar } from '../TimerBar';
import { Watermark } from '../Watermark';

const sectionDurationInSecs = 10;

export function FunniestMessage({
  shouldExit,
  onExitFinish,
  funniestGroupChatMessage,
}: {
  shouldExit: boolean;
  onExitFinish: () => void;
  funniestGroupChatMessage: FunniestMessageResult;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [tick, setTick] = useState<number>(0);

  const ar = useMemo(
    () => new AnimationRunner(sectionDurationInSecs, setTick),
    []
  );

  const controls = useAnimationControls();

  const { groupChatName, funniestMessage, numberReactions, contactName } =
    funniestGroupChatMessage[0];

  useEffect(() => {
    ar.addEvent(200, () => {
      controls.start({
        opacity: 1,
      });
    });

    ar.addEvent((sectionDurationInSecs - 1) * 1000, () => {
      controls.start({
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
      <TimerBar durationInSecs={sectionDurationInSecs} isBlue tick={tick} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
          loggingContext="FunniestMessage"
        />
      </motion.div>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '5vh 4vh',
        }}
        bgColor="blue.50"
        ref={ref}
        height="100%"
        width="100%"
      >
        <Watermark />
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={controls}
          style={{ lineHeight: 1.2, marginTop: '9vh' }}
        >
          <Text fontSize="2xl" fontWeight="bold">
            Funniest Message
          </Text>
          <Text fontSize="md">in {groupChatName.replaceAll(',', ', ')}</Text>
        </motion.div>
        <motion.div
          style={{ marginTop: '7vh' }}
          initial={{
            opacity: 0,
          }}
          animate={controls}
        >
          <span style={{ fontWeight: 600 }}>
            {numberReactions}
            {` `}
          </span>{' '}
          Haha
          {numberReactions > 1 ? 's' : ''}
        </motion.div>
        <motion.div
          style={{
            backgroundColor: '#0b93f6',
            width: '100%',
            padding: '2vh',
            color: 'white',
            borderRadius: 16,
            marginTop: '2vh',
            fontFamily:
              'Helvetica Neue, Helvetica, Arial, GT Walsheim Pro, sans-serif',
          }}
          initial={{
            opacity: 0,
          }}
          animate={controls}
        >
          {funniestMessage}
        </motion.div>
        <motion.div
          style={{ alignSelf: 'flex-end', marginTop: '2vh' }}
          initial={{
            opacity: 0,
          }}
          animate={controls}
        >
          From <span style={{ fontWeight: 600 }}>{contactName}</span>
        </motion.div>
      </Box>
    </Box>
  );
}
