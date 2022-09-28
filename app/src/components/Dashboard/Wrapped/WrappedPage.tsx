import { Box, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { SIDEBAR_WIDTH } from '../SideNavbar';

function WrappedYourFirstText() {
  return (
    <>
      <Box>Your first text this year</Box>
      <Box>{`"i love dogs"`}</Box>
    </>
  );
}

function WrappedIntro() {
  return (
    <>
      <Box>Welcome to Left on Read Wrapped</Box>
    </>
  );
}

function WrappedClosing() {
  return (
    <>
      <Box>Thanks for watching, share with your friends!</Box>
    </>
  );
}

function WrappedGradient({ children }: { children: React.ReactNode }) {
  // TODO(Danilowcz): make this move
  return (
    <Box
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
      }}
      bgGradient="linear(to-tr, #0695FF, #A334FA, #FF6968)"
    >
      {children}
    </Box>
  );
}

export function WrappedPage() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const components = [
    <WrappedIntro />,
    <WrappedYourFirstText />,
    <WrappedClosing />,
  ];

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
          left: `-${SIDEBAR_WIDTH / 2}px`, // im confused why it needs /2 to be centered but :shrug:
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
            width: '450px',
            height: '600px', // TODO(Danilowicz): make this 9 by 16 at the end
            borderRadius: 8,
            padding: '50px',
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
