import { Box, Text, theme as defaultTheme } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';

const sectionDurationInSecs = 6;

export function EveryoneScrolling({
  shouldExit,
  onExitFinish,
}: {
  shouldExit: boolean;
  onExitFinish: () => void;
}) {
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: '36px',
        borderRadius: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
      shadow="dark-lg"
      bgColor="purple.50"
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 5,
          backgroundColor: defaultTheme.colors.purple['500'],
        }}
        initial={{
          width: '0',
        }}
        animate={{
          width: '100%',
        }}
        transition={{
          duration: sectionDurationInSecs,
        }}
      />
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={controls}
        style={{ lineHeight: 1.2, display: 'flex', justifyContent: 'center' }}
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Text fontSize="3.3vh" fontWeight={600} textAlign="center">
            {' '}
            While everyone else was scrolling TikTok, you were busy{' '}
          </Text>
          {/* <Text fontSize="3.5vw" color="black" fontWeight={600}>
            texting.
          </Text> */}

          <TypeAnimation
            sequence={[
              't',
              1000,
              'te',
              200,
              'tex',
              500,
              'text',
              50,
              'texti',
              200,
              'textin',
              100,
              'texting',
              500,
              'texting.',
            ]}
            wrapper="div"
            cursor
            style={{ fontSize: '3.3vh', color: 'black', fontWeight: '600' }}
          />
        </Box>
      </motion.div>
    </Box>
  );
}
