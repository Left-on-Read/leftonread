import { Box, IconButton, theme as defaultTheme } from '@chakra-ui/react';
import { TopFriendsSimpleResult } from 'analysis/queries/WrappedQueries/TopFriendsSimpleQuery';
import { ipcRenderer } from 'electron';
import { motion, useAnimationControls } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { TotalSentVsReceivedResults } from '../../../analysis/queries/TotalSentVsReceivedQuery';
import { MostPopularDayResult } from '../../../analysis/queries/WrappedQueries/MostPopularDayQuery';
import { Gradient } from '../../Gradient';
import { useGlobalContext } from '../GlobalContext';
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

function WrappedGradient({
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

export function WrappedPage() {
  const { dateRange } = useGlobalContext();

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeTheme, setActiveTheme] = useState<'blue' | 'purple'>('purple');
  const [triggerExit, setTriggerExit] = useState<boolean>(false);
  const [sentVsReceivedData, setSentVsReceivedData] = useState<{
    sent: number;
    received: number;
  }>({ sent: 0, received: 0 });

  const [mostPopularDayData, setMostPopularDayData] =
    useState<MostPopularDayResult>({
      avgCount: 0,
      mostPopularCount: 0,
      mostPopularDate: new Date(),
    });

  const [topFriends, setTopFriends] = useState<TopFriendsSimpleResult>([]);

  const oneYearAgoDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 1)
  );
  const startDate =
    dateRange.earliestDate > oneYearAgoDate
      ? dateRange.earliestDate
      : oneYearAgoDate;

  // TODO(Danilowicz): Run this on page load and hope it's finished by the time wrapped starts
  useEffect(() => {
    async function fetchData() {
      const sentVsReceivedDataPromise: Promise<TotalSentVsReceivedResults> =
        ipcRenderer.invoke('query-total-sent-vs-received', { startDate });

      const mostPopularDayPromise: Promise<MostPopularDayResult> =
        ipcRenderer.invoke('query-most-popular-day', { startDate });

      const topFriendsSimplePromise: Promise<TopFriendsSimpleResult> =
        ipcRenderer.invoke('query-top-friends-simple', { startDate });

      const [sentVsReceivedResult, mostPopularDayResult, topFriendsResult] =
        await Promise.all([
          sentVsReceivedDataPromise,
          mostPopularDayPromise,
          topFriendsSimplePromise,
        ]);

      setMostPopularDayData(mostPopularDayResult);
      setTopFriends(topFriendsResult);
      setSentVsReceivedData({
        received:
          sentVsReceivedResult.filter((obj) => obj.is_from_me === 0)[0]
            ?.total ?? 0,
        sent:
          sentVsReceivedResult.filter((obj) => obj.is_from_me === 1)[0]
            ?.total ?? 0,
      });
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (activeIndex === 8) {
      setActiveTheme('blue');
    } else if (activeIndex === 7) {
      setActiveTheme('purple');
    }
  }, [activeIndex]);

  // TODO: Refactor this - this is getting pretty expensive bc of re-renders.
  const components = [
    <WrappedIntro
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
      startDate={startDate}
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
      data={sentVsReceivedData}
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
      mostPopularDayData={mostPopularDayData}
    />,
    <MostMessages
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
      topFriends={topFriends}
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
      topFriends={topFriends}
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
    <WrappedGradient theme={activeTheme}>
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
              width: '47.8125vh',
              height: '85vh',
              borderRadius: 16,
            }}
          >
            {selectedComponent}
          </Box>
          {/* <Box>
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
          </Box> */}
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
