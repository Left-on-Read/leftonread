import { Box, IconButton, theme as defaultTheme } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { start } from 'repl';

import { EngagementResult } from '../../../analysis/queries/EngagementQueries';
import { SharedQueryFilters } from '../../../analysis/queries/filters/sharedQueryFilters';
import { GroupChatByFriends } from '../../../analysis/queries/GroupChats/GroupChatByFriendsQuery';
import { TotalSentVsReceivedResults } from '../../../analysis/queries/TotalSentVsReceivedQuery';
import {
  IWordOrEmojiFilters,
  TWordOrEmojiResults,
} from '../../../analysis/queries/WordOrEmojiQuery';
import { FunniestMessageResult } from '../../../analysis/queries/WrappedQueries/FunniestMessageQuery';
import { MostPopularDayResult } from '../../../analysis/queries/WrappedQueries/MostPopularDayQuery';
import {
  TopFriendCountAndWordSimpleResult,
  TopFriendsSimpleResult,
} from '../../../analysis/queries/WrappedQueries/TopFriendsSimpleQuery';
import { GroupChatFilters } from '../../../constants/filters';
import { logEvent } from '../../../utils/analytics';
import { useGlobalContext } from '../GlobalContext';
import { BusiestDay } from './Sections/BusiestDay';
import { DayInParticular } from './Sections/DayInParticular';
import { EveryoneScrolling } from './Sections/EveryoneScrolling';
import { FriendList } from './Sections/FriendList';
import { FunniestMessage } from './Sections/FunniestMessage';
import { LeftOnReadStats } from './Sections/LeftOnReadStats';
import { MostMessages } from './Sections/MostMessages';
import { OtherFriendsToo } from './Sections/OtherFriendsToo';
import { Overview } from './Sections/Overview';
import { SentEmojiList } from './Sections/SentEmojiList';
import { SentWordList } from './Sections/SentWordList';
import { Thanks } from './Sections/Thanks';
import { ThereWereFunnyMoments } from './Sections/ThereWereFunnyMoments';
import { TopFriend } from './Sections/TopFriend';
import { TopGroupChat } from './Sections/TopGroupChat';
import { TotalCount } from './Sections/TotalCount';
import { WrappedError } from './Sections/WrappedError';
import { WrappedIntro } from './Sections/WrappedIntro';
import { WrappedIntroTexts } from './Sections/WrappedIntroTexts';
import { WrappedLoading } from './Sections/WrappedLoading';
import { YouTexting } from './Sections/YouTexting';
import { WrappedGradient } from './WrappedGradient';

export const DURATION_OF_SLIDE_IN_SECS = 10;

export function WrappedPage() {
  const { dateRange } = useGlobalContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeTheme, setActiveTheme] = useState<'blue' | 'purple' | 'green'>(
    'purple'
  );
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
  const [topFriendWordAndCount, setTopFriendWordAndCount] =
    useState<TopFriendCountAndWordSimpleResult>({
      friend: 'Steve Jobs',
      sentTotal: 100,
      receivedTotal: 100,
      word: 'lol',
    });
  const [topGroupChatAndFriend, setTopGroupChatAndFriend] = useState<
    GroupChatByFriends[]
  >([]);

  const [topSentWords, setTopSentWords] = useState<TWordOrEmojiResults>([]);
  const [topSentEmojis, setTopSentEmojis] = useState<TWordOrEmojiResults>([]);
  const [funniestGroupChatMessage, setFunniestGroupChatMessage] =
    useState<FunniestMessageResult>([]);
  const [leftOnReadData, setLeftOnReadData] = useState<EngagementResult[]>([]);

  const oneYearAgoDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 1)
  );
  const startDate =
    dateRange.earliestDate > oneYearAgoDate
      ? dateRange.earliestDate
      : oneYearAgoDate;

  async function fetchData() {
    setIsLoading(true);
    setError(null);

    try {
      const dateFilter: SharedQueryFilters = {
        timeRange: { startDate },
      };
      const dateAndGroupChatFilter: SharedQueryFilters = {
        ...dateFilter,
        groupChat: GroupChatFilters.ONLY_INDIVIDUAL,
      };
      const sentVsReceivedDataPromise: Promise<TotalSentVsReceivedResults> =
        ipcRenderer.invoke(
          'query-total-sent-vs-received',
          dateAndGroupChatFilter
        );

      const mostPopularDayPromise: Promise<MostPopularDayResult> =
        ipcRenderer.invoke('query-most-popular-day', dateFilter);

      const topFriendsSimplePromise: Promise<TopFriendsSimpleResult> =
        ipcRenderer.invoke('query-top-friends-simple', dateAndGroupChatFilter);

      const topFriendWordAndCountPromise: Promise<TopFriendCountAndWordSimpleResult> =
        ipcRenderer.invoke(
          'query-top-friend-count-and-word-simple',
          dateFilter
        );

      const topGroupChatAndFriendPromise: Promise<GroupChatByFriends[]> =
        ipcRenderer.invoke(
          'query-group-chat-by-friends',
          dateFilter,
          'COUNT',
          1
        );

      const wordFilter: IWordOrEmojiFilters = {
        timeRange: { startDate },
        isEmoji: false,
        isFromMe: true,
        limit: 5,
      };
      const topSentWordsPromise: Promise<TWordOrEmojiResults> =
        ipcRenderer.invoke('query-word-emoji', wordFilter);
      const emojiFilter: IWordOrEmojiFilters = { ...wordFilter, isEmoji: true };
      const topSentEmojisPromise: Promise<TWordOrEmojiResults> =
        ipcRenderer.invoke('query-word-emoji', emojiFilter);

      const funniestGroupChatPromise: Promise<FunniestMessageResult> =
        ipcRenderer.invoke(
          'query-funniest-message-group-chat',
          dateAndGroupChatFilter
        );

      // Purposely not filtering by a date here because otherwise the number is low
      const leftOnReadPromise: Promise<EngagementResult[]> = ipcRenderer.invoke(
        'query-left-on-read',
        { groupChat: GroupChatFilters.ONLY_INDIVIDUAL }
      );

      const [
        sentVsReceivedResult,
        mostPopularDayResult,
        topFriendsResult,
        topFriendWordAndCountResult,
        topGroupChatAndFriendResult,
        topSentWordsResult,
        topSentEmojisResult,
        funniestGroupChatResult,
        leftOnReadResult,
      ] = await Promise.all([
        sentVsReceivedDataPromise,
        mostPopularDayPromise,
        topFriendsSimplePromise,
        topFriendWordAndCountPromise,
        topGroupChatAndFriendPromise,
        topSentWordsPromise,
        topSentEmojisPromise,
        funniestGroupChatPromise,
        leftOnReadPromise,
      ]);

      if (topGroupChatAndFriendResult.length < 1) {
        // TODO: skip page if there's a problem?
        setTopGroupChatAndFriend([
          { group_chat_name: '', contact_name: '', count: 0 },
        ]);
      } else {
        setTopGroupChatAndFriend(topGroupChatAndFriendResult);
      }
      if (funniestGroupChatResult.length < 1) {
        // TODO: skip page if there's a problem?
        setFunniestGroupChatMessage([
          {
            groupChatName: '',
            funniestMessage: '',
            numberReactions: 0,
            contactName: '',
          },
        ]);
      } else {
        setFunniestGroupChatMessage(funniestGroupChatResult);
      }

      if (leftOnReadResult.length < 1) {
        setLeftOnReadData([
          {
            value: 0,
            isFromMe: 0,
          },
          {
            value: 0,
            isFromMe: 1,
          },
        ]);
      } else {
        setLeftOnReadData(leftOnReadResult);
      }

      setTopSentWords(topSentWordsResult);
      setTopSentEmojis(topSentEmojisResult);
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
      setTopFriendWordAndCount(topFriendWordAndCountResult);
    } catch (err: unknown) {
      log.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Internal Error');
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

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
      topFriendWordAndCount={topFriendWordAndCount}
    />,
    <OtherFriendsToo
      topFriend={topFriendWordAndCount.friend}
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
      topGroupChatAndFriend={topGroupChatAndFriend}
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
      funniestGroupChatMessage={funniestGroupChatMessage}
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
      topSentWords={topSentWords}
    />,
    <SentEmojiList
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
      topSentEmojis={topSentEmojis}
    />,
    <LeftOnReadStats
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
      leftOnReadData={leftOnReadData}
    />,
    <Thanks
      shouldExit={triggerExit}
      onExitFinish={() => {
        setActiveIndex(activeIndex + 1);
        setTriggerExit(false);
      }}
    />,
    <Overview
      overviewData={{
        topFriend: topFriendWordAndCount.friend,
        sentCount: sentVsReceivedData.sent,
        receivedCount: sentVsReceivedData.received,
        words: topSentWords.map((c) => c.word).slice(0, 3),
        emojis: topSentEmojis.map((c) => c.word).slice(0, 3),
      }}
    />,
  ];

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (isLoading) {
        return;
      }

      switch (event.keyCode) {
        case 37:
          if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
          }
          break;
        case 39:
          if (activeIndex + 1 < components.length) {
            setActiveIndex(activeIndex + 1);
          }
          break;
        default:
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
    // eslint-disable-next-line
  }, [activeIndex]);

  useEffect(() => {
    logEvent({
      eventName: 'WRAPPED_SECTION',
      properties: {
        page: activeIndex,
      },
    });

    if (activeIndex === 7) {
      setActiveTheme('purple');
    } else if (activeIndex === 8) {
      setActiveTheme('blue');
    } else if (activeIndex === 17) {
      setActiveTheme('blue');
    } else if (activeIndex === 18) {
      setActiveTheme('green');
    }
  }, [activeIndex]);

  let selectedComponent = components[activeIndex];
  if (error) {
    selectedComponent = (
      <WrappedError
        error={error}
        onRetry={() => {
          fetchData();
        }}
      />
    );
  } else if (isLoading) {
    selectedComponent = <WrappedLoading />;
  }

  const iconSize = 50;

  let showLeftIcon: 'hidden' | undefined =
    activeIndex === 0 ? 'hidden' : undefined;
  if (isLoading || error) {
    showLeftIcon = 'hidden';
  }

  let showRightIcon: 'hidden' | undefined =
    activeIndex === components.length - 1 ? 'hidden' : undefined;
  if (isLoading || error) {
    showRightIcon = 'hidden';
  }

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
          visibility={showLeftIcon}
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
          visibility={showRightIcon}
        />
      </Box>
    </WrappedGradient>
  );
}
