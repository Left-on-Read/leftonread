import { motion } from 'framer-motion';
import React from 'react';

export function Float({
  children,
  circleShadowDimensions,
}: {
  children: React.ReactNode;
  circleShadowDimensions?: {
    marginTop: number;
    width: number;
  };
}) {
  return (
    <div style={{ width: 'fit-content' }}>
      <div
        style={
          circleShadowDimensions
            ? {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 0,
              }
            : {}
        }
      >
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
        {circleShadowDimensions && (
          <motion.div
            style={{
              marginTop: circleShadowDimensions.marginTop,
              height: 18,
              width: circleShadowDimensions.width,
              borderRadius: '50%',
              backgroundColor: 'lightgray',
            }}
            transition={{
              type: 'spring',
              duration: 4,
              repeat: Infinity,
            }}
            animate={{
              width: [
                circleShadowDimensions.width,
                circleShadowDimensions.width * 0.8,
                circleShadowDimensions.width,
              ],
            }}
          />
        )}
      </div>
    </div>
  );
}
