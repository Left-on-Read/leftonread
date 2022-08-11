import { motion } from 'framer-motion';
import React from 'react';

export function Float({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      transition={{
        type: 'spring',
        duration: 4,
        repeat: Infinity,
      }}
      animate={{ y: [5, -5, 5] }}
    >
      {children}
    </motion.div>
  );
}
