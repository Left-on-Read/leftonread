import { theme as defaultTheme } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export function TimerBar({ durationInSecs }: { durationInSecs: number }) {
  return (
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
        duration: durationInSecs,
      }}
    />
  );
}
