import {
  Box,
  Button,
  IconButton,
  theme as defaultTheme,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { Gradient } from '../../Gradient';
import { BusiestDay } from './Sections/BusiestDay';
import { DayInParticular } from './Sections/DayInParticular';
import { EveryoneScrolling } from './Sections/EveryoneScrolling';
import { FriendList } from './Sections/FriendList';
import { FunniestMessage } from './Sections/FunniestMessage';
import { LeftOnReadStats } from './Sections/LeftOnReadStats';
import { MostMessages } from './Sections/MostMessages';
import { OtherFriendsToo } from './Sections/OtherFriendsToo';
import { SentEmojiList } from './Sections/SentEmojiList';
import { SentWordList } from './Sections/SentWordList';
import { Thanks } from './Sections/Thanks';
import { ThereWereFunnyMoments } from './Sections/ThereWereFunnyMoments';
import { TopFriend } from './Sections/TopFriend';
import { TopGroupChat } from './Sections/TopGroupChat';
import { TotalCount } from './Sections/TotalCount';
import { WrappedIntro } from './Sections/WrappedIntro';
import { WrappedIntroTexts } from './Sections/WrappedIntroTexts';
import { YouTexting } from './Sections/YouTexting';

export const DURATION_OF_SLIDE_IN_SECS = 10;

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
              '--gradient-color-1': defaultTheme.colors.purple['200'],
              '--gradient-color-2': defaultTheme.colors.purple['300'],
              '--gradient-color-3': defaultTheme.colors.gray['300'],
              '--gradient-color-4': defaultTheme.colors.gray['200'],
            } as any
          }
        />
      </div>

      {children}
    </Box>
  );
}

export function WrappedPage() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [triggerExit, setTriggerExit] = useState<boolean>(false);

  const components = [
    <WrappedIntro
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <WrappedIntroTexts
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <EveryoneScrolling
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <TotalCount
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <DayInParticular
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <BusiestDay
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <MostMessages
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <TopFriend
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <OtherFriendsToo
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <FriendList
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <TopGroupChat
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <ThereWereFunnyMoments
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <FunniestMessage
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <YouTexting
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <SentWordList
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <SentEmojiList
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <LeftOnReadStats
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <Thanks
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
  ];

  const selectedComponent = components[activeIndex];
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
            if (activeIndex !== 0) {
              setActiveIndex(activeIndex - 1);
              setTriggerExit(false);
            }
          }}
          isDisabled={activeIndex === 0}
          colorScheme="transparent"
          aria-label="left"
          icon={<FiChevronLeft />}
          fontSize={iconSize}
          visibility={activeIndex === 0 ? 'hidden' : undefined}
        />
        <Box>
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
          <Box>
            <Button
              as={Box}
              colorScheme="purple"
              onClick={() => setTriggerExit(true)}
              style={{
                width: '100%',
                cursor: 'pointer',
                marginTop: 24,
              }}
            >
              {activeIndex > 0 ? 'Share' : 'Lets Go'}
            </Button>
          </Box>
        </Box>
        <IconButton
          onClick={() => {
            if (activeIndex === 0) {
              setTriggerExit(true);
            } else if (activeIndex !== components.length - 1) {
              setActiveIndex(activeIndex + 1);
              setTriggerExit(false);
            }
          }}
          colorScheme="transparent"
          aria-label="right"
          icon={<FiChevronRight />}
          fontSize={iconSize}
          visibility={
            activeIndex === components.length - 1 ? 'hidden' : undefined
          }
        />
      </Box>
    </WrappedGradient>
  );
}
