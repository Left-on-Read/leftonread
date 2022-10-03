import { theme as defaultTheme } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export function TimerBar({
  durationInSecs,
  isBlue,
}: {
  durationInSecs: number;
  isBlue?: boolean;
}) {
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
        width: '0',
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
