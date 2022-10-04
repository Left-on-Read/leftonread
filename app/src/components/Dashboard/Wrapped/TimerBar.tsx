import { theme as defaultTheme } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export function TimerBar({
  tick,
  durationInSecs,
  isBlue,
}: {
  tick?: number;
  durationInSecs: number;
  isBlue?: boolean;
}) {
  // const controls = useAnimationControls();

  // useEffect(() => {
  //   if (!isPaused) {
  //     controls.start({
  //       width: '100%',
  //       transition: {
  //         duration: durationInSecs - tick / 1000,
  //       },
  //     });
  //   } else {
  //     controls.stop();
  //   }
  // }, [controls, isPaused]);

  if (tick === undefined) {
    return (
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 5,
          backgroundColor: isBlue
            ? defaultTheme.colors.blue['500']
            : defaultTheme.colors.purple['500'],
          zIndex: 3,
        }}
        initial={{
          width: '0%',
        }}
        animate={{
          width: '100%',
        }}
        transition={{
          duration: durationInSecs,
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: 5,
        backgroundColor: isBlue
          ? defaultTheme.colors.blue['500']
          : defaultTheme.colors.purple['500'],
        zIndex: 3,
        width: `${tick / (durationInSecs * 10 - 10)}%`,
        transition: 'width 1s linear',
      }}
      // animate={controls}
      // transition={{
      //   duration: durationInSecs,
      // }}
    />
  );
}
