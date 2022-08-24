import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { SharedQueryFilters } from 'analysis/queries/filters/sharedQueryFilters';
import { EngagementScoreChart } from 'components/Graphs/EngagementScore/EngagementScoreChart';
import {
  FiArrowUpCircle,
  FiAward,
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiEdit3,
  FiMeh,
  FiMessageCircle,
  FiPercent,
  FiRadio,
  FiStar,
  FiUsers,
  FiWatch,
} from 'react-icons/fi';

import { daysAgo } from '../../main/util';
import { logEvent } from '../../utils/analytics';
import { AverageDelayChart } from '../Graphs/AverageDelayChart';
import { SentimentOverTimeChart } from '../Graphs/SentimentOverTimeChart';
import { SentVsReceivedChart } from '../Graphs/SentVsReceivedChart';
import { TextsOverTimeChart } from '../Graphs/TextsOverTimeChart';
import { TimeOfDayChart } from '../Graphs/TimeOfDayChart';
import { TopFriendsChart } from '../Graphs/TopFriendsChart';
import { TopSentimentFriendsChart } from '../Graphs/TopSentimentFriendsChart';
import { TotalSentimentChart } from '../Graphs/TotalSentimentChart';
import { WordOrEmojiCountChart } from '../Graphs/WordOrEmojiCountChart';
import { useGlobalContext } from './GlobalContext';

export function ChartTabs({ filters }: { filters: SharedQueryFilters }) {
  const { dateRange, isLoading: isGlobalContextLoading } = useGlobalContext();

  return (
    <div>
      {/* <span>
        Last text message: {earliestAndLatestDate?.latestDate.toLocaleString()}
      </span> */}
      <Tabs
        variant="soft-rounded"
        colorScheme="purple"
        size="md"
        onChange={(index) => {
          let activeTab = 'Activity';
          if (index === 1) {
            activeTab = 'Words & Emojis';
          } else if (index === 2) {
            activeTab = 'Sentiment';
          } else if (index === 3) {
            activeTab = 'Coming Soon...';
          }

          logEvent({
            eventName: 'SET_ACTIVE_TAB',
            properties: {
              activeTab,
            },
          });
        }}
        isLazy
      >
        <TabList
          style={{
            position: 'fixed',
            backgroundColor: 'white',
            paddingBottom: 24,
            width: '100%',
            background:
              'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 25%, rgba(255,255,255,1) 100%)',
            zIndex: 3,
          }}
        >
          {/* IF YOU CHANGE THE TABS - PLEASE CHANGE LOGGING ABOVE */}
          <Tab style={{ marginRight: 32 }}>
            <span style={{ marginRight: 10 }}>📱</span>Activity
          </Tab>
          <Tab style={{ marginRight: 32 }}>
            <span style={{ marginRight: 10 }}>😃</span>Words & Emojis
          </Tab>
          <Tab style={{ marginRight: 32 }}>
            <span style={{ marginRight: 10 }}>❤️</span>Sentiment
          </Tab>
          <Tab style={{ marginRight: 32 }}>
            <span style={{ marginRight: 10 }}>⚡ </span>Engagement
          </Tab>
        </TabList>
        <TabPanels style={{ paddingTop: 60 }}>
          <TabPanel>
            <div>
              <SentVsReceivedChart
                title="Total Sent vs Received"
                description={
                  isGlobalContextLoading
                    ? `since...`
                    : `since ${dateRange.earliestDate.toLocaleDateString()} (${daysAgo(
                        dateRange.earliestDate,
                        new Date()
                      )} days ago)`
                }
                icon={FiMessageCircle}
                filters={filters}
              />
              <TopFriendsChart
                title="Top Messaged Friends"
                description=""
                icon={FiUsers}
                filters={filters}
              />
              <TimeOfDayChart
                title="Messages by Time of Day"
                description="represented in your local time zone"
                icon={FiClock}
                filters={filters}
              />
              <TextsOverTimeChart
                title="Number of Messages Per Day"
                description=""
                icon={FiCalendar}
                filters={filters}
              />
            </div>
          </TabPanel>
          <TabPanel>
            <div>
              <WordOrEmojiCountChart
                title="Top Received Emojis"
                description=""
                icon={FiStar}
                labelText="Count of Received Emojis"
                filters={filters}
                isEmoji
                isFromMe={false}
              />
              <WordOrEmojiCountChart
                title="Top Sent Emojis"
                description=""
                icon={FiMeh}
                labelText="Count of Sent Emojis"
                filters={filters}
                isEmoji
                isFromMe
              />
              <WordOrEmojiCountChart
                title="Top Received Words"
                description=""
                icon={FiBookOpen}
                labelText="Count of Received Words"
                filters={filters}
                isEmoji={false}
                isFromMe={false}
              />
              <WordOrEmojiCountChart
                title="Top Sent Words"
                description=""
                icon={FiEdit3}
                labelText="Count of Sent Words"
                filters={filters}
                isEmoji={false}
                isFromMe
              />
            </div>
          </TabPanel>
          <TabPanel>
            <div>
              <TotalSentimentChart
                title="Percent Positivity Overview"
                description="A weighted percentage of how positive your texts are."
                icon={FiAward}
                filters={filters}
              />
              <SentimentOverTimeChart
                title="Percent Positivity Over Time"
                icon={FiPercent}
                filters={filters}
              />
              <TopSentimentFriendsChart
                title="Most Positive Conversations"
                description="Minimum of 25 messages sent and received"
                icon={FiArrowUpCircle}
                filters={filters}
              />
            </div>
          </TabPanel>
          {/* <TabPanel>
            <ComingSoon />
          </TabPanel> */}
          <TabPanel>
            <div>
              <EngagementScoreChart
                title="Engagement Score ™"
                description={`Measures how "good" of a texter you are.`}
                icon={FiRadio}
                filters={filters}
              />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
