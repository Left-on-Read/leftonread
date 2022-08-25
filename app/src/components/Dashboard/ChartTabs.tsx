import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
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
} from 'react-icons/fi';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { GroupChatFilters } from '../../constants/filters';
import { daysAgo } from '../../main/util';
import { logEvent } from '../../utils/analytics';
import { EngagementScoreChart } from '../Graphs/EngagementScore/EngagementScoreChart';
import { SentimentOverTimeChart } from '../Graphs/SentimentOverTimeChart';
import { SentVsReceivedChart } from '../Graphs/SentVsReceivedChart';
import { TextsOverTimeChart } from '../Graphs/TextsOverTimeChart';
import { TimeOfDayChart } from '../Graphs/TimeOfDayChart';
import { TopFriendsChart } from '../Graphs/TopFriendsChart';
import { TopSentimentFriendsChart } from '../Graphs/TopSentimentFriendsChart';
import { TotalSentimentChart } from '../Graphs/TotalSentimentChart';
import { WordOrEmojiCountChart } from '../Graphs/WordOrEmojiCountChart';
import { useGlobalContext } from './GlobalContext';

export const titleFormatter = ({
  titleName,
  filters,
}: {
  titleName: string;
  filters: SharedQueryFilters;
}) => {
  let title = titleName;
  const { contact } = filters;
  if (contact?.length === 1) {
    const word = titleName.toLowerCase().includes('sent') ? 'to' : 'from';
    title += ` ${word} ${contact[0].label}`;
  }
  // TODO(Danilowicz): add who is excluded here.
  // As I think most people will exclude their S.O.
  // And want to be reminded who they are excluding

  return title;
};

export const descriptionFormatter = ({
  description,
  filters,
}: {
  description: string;
  filters: SharedQueryFilters;
}) => {
  let descriptionString = description;
  const { groupChat } = filters;

  if (descriptionString && groupChat === GroupChatFilters.BOTH) {
    descriptionString += `, includes group chats`;
  } else if (
    descriptionString &&
    groupChat === GroupChatFilters.ONLY_INDIVIDUAL
  ) {
    descriptionString += `, excludes group chats`;
  } else if (groupChat === GroupChatFilters.BOTH) {
    descriptionString += 'includes group chats';
  } else {
    descriptionString += 'excludes group chats';
  }

  return descriptionString;
};

export function ChartTabs({ filters }: { filters: SharedQueryFilters }) {
  const { dateRange, isLoading: isGlobalContextLoading } = useGlobalContext();

  return (
    <div>
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
            activeTab = 'Engagement';
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
                title={titleFormatter({
                  titleName: 'Total Sent vs Received',
                  filters,
                })}
                description={descriptionFormatter({
                  description: isGlobalContextLoading
                    ? ``
                    : `since ${dateRange.earliestDate.toLocaleDateString()} (${daysAgo(
                        dateRange.earliestDate,
                        new Date()
                      )} days ago)`,
                  filters,
                })}
                icon={FiMessageCircle}
                filters={filters}
              />
              <TopFriendsChart
                title={titleFormatter({
                  titleName:
                    filters.contact?.length === 1
                      ? 'Sent vs Received'
                      : 'Top Messaged Friends',
                  filters,
                })}
                description={descriptionFormatter({ description: '', filters })}
                icon={FiUsers}
                filters={filters}
              />
              <TimeOfDayChart
                title={titleFormatter({
                  titleName: 'Messages by Time of Day',
                  filters,
                })}
                description={descriptionFormatter({
                  description: 'represented in your local time zone',
                  filters,
                })}
                icon={FiClock}
                filters={filters}
              />
              <TextsOverTimeChart
                title={titleFormatter({
                  titleName: 'Number of Messages Per Day',
                  filters,
                })}
                description={descriptionFormatter({ description: '', filters })}
                icon={FiCalendar}
                filters={filters}
              />
            </div>
          </TabPanel>
          <TabPanel>
            <div>
              <WordOrEmojiCountChart
                title={titleFormatter({
                  titleName: 'Top Received Emojis',
                  filters,
                })}
                description={descriptionFormatter({ description: '', filters })}
                icon={FiStar}
                labelText="Count of Received Emojis"
                filters={filters}
                isEmoji
                isFromMe={false}
              />
              <WordOrEmojiCountChart
                title={titleFormatter({
                  titleName: 'Top Sent Emojis',
                  filters,
                })}
                description={descriptionFormatter({ description: '', filters })}
                icon={FiMeh}
                labelText="Count of Sent Emojis"
                filters={filters}
                isEmoji
                isFromMe
              />
              <WordOrEmojiCountChart
                title={titleFormatter({
                  titleName: 'Top Received Words',
                  filters,
                })}
                description={descriptionFormatter({ description: '', filters })}
                icon={FiBookOpen}
                labelText="Count of Received Words"
                filters={filters}
                isEmoji={false}
                isFromMe={false}
              />
              <WordOrEmojiCountChart
                title={titleFormatter({
                  titleName: 'Top Sent Words',
                  filters,
                })}
                description={descriptionFormatter({ description: '', filters })}
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
                title={titleFormatter({
                  titleName: 'Percent Positivity Overview',
                  filters,
                })}
                description={descriptionFormatter({
                  description:
                    'A weighted percentage of how positive your texts are',
                  filters,
                })}
                icon={FiAward}
                filters={filters}
              />
              <SentimentOverTimeChart
                title={titleFormatter({
                  titleName: 'Percent Positivity Over Time',
                  filters,
                })}
                icon={FiPercent}
                filters={filters}
              />
              <TopSentimentFriendsChart
                title={titleFormatter({
                  titleName: 'Most Positive Conversations',
                  filters,
                })}
                description={descriptionFormatter({
                  description: 'Minimum of 25 messages sent and received',
                  filters,
                })}
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
                title={titleFormatter({
                  titleName: 'Engagement Score ™',
                  filters,
                })}
                description={descriptionFormatter({
                  description: `Measures how "good" of a texter you are`,
                  filters,
                })}
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
