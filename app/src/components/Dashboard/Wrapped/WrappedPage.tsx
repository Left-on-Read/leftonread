import { Box, IconButton } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { Gradient } from '../../Gradient';
import { WrappedIntro } from './Sections/WrappedIntro';

function WrappedGradient({ children }: { children: React.ReactNode }) {
  const [color, setColor] = useState<string>('D6BCFA');

  useEffect(() => {
    const gradient = new Gradient();
    // @ts-ignore
    gradient.initGradient('#gradient-canvas');

    // setTimeout(() => {
    //   setColor('0BC5EA');
    //   setTimeout(() => {
    //     // @ts-ignore
    //     gradient.initGradient('#gradient-canvas');
    //   }, 500);
    // }, 5000);
  }, []);

  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%' }}>
        <canvas
          id="gradient-canvas"
          data-transition-in
          style={
            {
              '--gradient-color-1': `#D6BCFA`,
              '--gradient-color-2': '#E9D8FD',
              '--gradient-color-3': '#FAF5FF',
              '--gradient-color-4': '#EDF2F7',
            } as any
          }
        />
      </div>

      {children}
    </Box>
  );
}

export function WrappedPage() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const components = [<WrappedIntro />];

  const selectedComponent = components[selectedIndex];
  const iconSize = 50;

  return (
    <WrappedGradient>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 'auto',
          position: 'relative',
        }}
      >
        <IconButton
          onClick={() => {
            if (selectedIndex !== 0) {
              setSelectedIndex(selectedIndex - 1);
            }
          }}
          isDisabled={selectedIndex === 0}
          colorScheme="transparent"
          aria-label="left"
          icon={<FiChevronLeft />}
          fontSize={iconSize}
          visibility={selectedIndex === 0 ? 'hidden' : undefined}
        />
        <Box
          style={{
            zIndex: 1,
            backgroundColor: 'white',
            width: '45vh',
            height: '80vh',
            borderRadius: 16,
          }}
        >
          {selectedComponent}
        </Box>
        <IconButton
          onClick={() => {
            if (selectedIndex !== components.length - 1) {
              setSelectedIndex(selectedIndex + 1);
            }
          }}
          colorScheme="transparent"
          aria-label="right"
          icon={<FiChevronRight />}
          fontSize={iconSize}
          visibility={
            selectedIndex === components.length - 1 ? 'hidden' : undefined
          }
        />
      </Box>
    </WrappedGradient>
  );
}
