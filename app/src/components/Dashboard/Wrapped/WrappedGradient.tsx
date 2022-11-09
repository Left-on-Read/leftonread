import { Box, IconButton, theme as defaultTheme } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import { motion, useAnimationControls } from 'framer-motion';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { Gradient } from '../../Gradient';

function InternalWrappedGradient({
  theme,
  children,
}: {
  theme: 'blue' | 'purple' | 'green';
  children: React.ReactNode;
}) {
  const blueControls = useAnimationControls();
  const purpleControls = useAnimationControls();
  const greenControls = useAnimationControls();

  useEffect(() => {
    const gradientPurple = new Gradient();
    const gradientBlue = new Gradient();
    const gradientGreen = new Gradient();
    // @ts-ignore
    gradientPurple.initGradient('#gradient-canvas-purple');

    // @ts-ignore
    gradientBlue.initGradient('#gradient-canvas-blue');

    // @ts-ignore
    gradientGreen.initGradient('#gradient-canvas-green');
  }, []);

  useEffect(() => {
    if (theme === 'blue') {
      blueControls.start({
        opacity: 1,
      });
      purpleControls.start({
        opacity: 0,
      });
      greenControls.start({
        opacity: 0,
      });
    }

    if (theme === 'purple') {
      blueControls.start({
        opacity: 0,
      });
      greenControls.start({
        opacity: 0,
      });
      purpleControls.start({
        opacity: 1,
      });
    }

    if (theme === 'green') {
      blueControls.start({
        opacity: 0,
      });
      purpleControls.start({
        opacity: 0,
      });
      greenControls.start({
        opacity: 1,
      });
    }
  }, [theme, blueControls, purpleControls, greenControls]);

  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{ position: 'absolute', top: 0, left: 0, height: '100%' }}
        initial={{ opacity: 0 }}
        animate={purpleControls}
        transition={{
          duration: 1,
        }}
      >
        <canvas
          id="gradient-canvas-purple"
          data-transition-in
          style={
            {
              '--gradient-color-1': defaultTheme.colors.purple['200'],
              '--gradient-color-2': defaultTheme.colors.purple['300'],
              '--gradient-color-3': defaultTheme.colors.gray['300'],
              '--gradient-color-4': defaultTheme.colors.gray['200'],
              height: '100%',
            } as any
          }
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={blueControls}
        style={{ position: 'absolute', top: 0, left: 0, height: '100%' }}
        transition={{
          duration: 1,
        }}
      >
        <canvas
          id="gradient-canvas-blue"
          data-transition-in
          style={
            {
              '--gradient-color-1': defaultTheme.colors.blue['200'],
              '--gradient-color-2': defaultTheme.colors.blue['300'],
              '--gradient-color-3': defaultTheme.colors.gray['300'],
              '--gradient-color-4': defaultTheme.colors.gray['200'],
              height: '100%',
            } as any
          }
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={greenControls}
        style={{ position: 'absolute', top: 0, left: 0, height: '100%' }}
        transition={{
          duration: 1,
        }}
      >
        <canvas
          id="gradient-canvas-green"
          data-transition-in
          style={
            {
              '--gradient-color-1': defaultTheme.colors.green['200'],
              '--gradient-color-2': defaultTheme.colors.green['300'],
              '--gradient-color-3': defaultTheme.colors.gray['300'],
              '--gradient-color-4': defaultTheme.colors.gray['200'],
              height: '100%',
            } as any
          }
        />
      </motion.div>
      {children}
    </Box>
  );
}

export const WrappedGradient = memo(InternalWrappedGradient);
