import {
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
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
import { logEvent } from '../../utils/analytics';
import { EngagementScoreChart } from '../Graphs/EngagementScore/EngagementScoreChart';
import { FriendsOverTimeChart } from '../Graphs/FriendsOverTimeChart';
import { SentimentOverTimeChart } from '../Graphs/SentimentOverTimeChart';
import { SentVsReceivedChart } from '../Graphs/SentVsReceivedChart';
import { TextsOverTimeChart } from '../Graphs/TextsOverTimeChart';
import { TimeOfDayChart } from '../Graphs/TimeOfDayChart';
import { TopFriendsChart } from '../Graphs/TopFriendsChart';
import { TopSentimentFriendsChart } from '../Graphs/TopSentimentFriendsChart';
import { TotalSentimentChart } from '../Graphs/TotalSentimentChart';
import { WordOrEmojiCountChart } from '../Graphs/WordOrEmojiCountChart';
import { useGlobalContext } from './GlobalContext';
import { GroupChatTab } from './GroupChatTab';
import { SIDEBAR_WIDTH } from './SideNavbar';

export const titleFormatter = ({
  titleName,
  filters,
}: {
  titleName: string;
  filters: SharedQueryFilters;
}) => {
  const title = [titleName];
  const { contact } = filters;
  if (contact?.length === 1) {
    const word = titleName.toLowerCase().includes('sent') ? 'to' : 'from';
    title.push(` ${word} ${contact[0].label}`);
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

  const earlyDate = filters.timeRange?.startDate
    ? filters.timeRange.startDate
    : dateRange.earliestDate;
  const lateDate = filters.timeRange?.endDate
    ? filters.timeRange?.endDate
    : dateRange.latestDate;
  const daysAgoDescription = `between ${earlyDate.toLocaleDateString()} and ${lateDate.toLocaleDateString()}`;

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
            activeTab = 'Group Chats';
          } else if (index === 3) {
            activeTab = 'Sentiment';
          }

          logEvent({
            eventName: 'SET_ACTIVE_TAB',
            properties: {
              activeTab,
            },
          });
        }}
      >
        <TabList
          style={{
            backgroundColor: 'white',
            width: '100%',
            background:
              'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 25%, rgba(255,255,255,1) 100%)',
            zIndex: 6,
            position: 'fixed',
            padding: `12px ${SIDEBAR_WIDTH + 36}px 12px 36px`,
            display: 'flex',
            justifyContent: 'space-around',
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
            <span style={{ marginRight: 10 }}>👨‍👩‍👦</span>Groups
          </Tab>
          <Tab style={{ marginRight: 32 }}>
            <span style={{ marginRight: 10 }}>❤️</span>Sentiment
          </Tab>
        </TabList>
        <TabPanels style={{ padding: '70px 36px 36px 36px' }}>
          <TabPanel>
            <Stack direction="column" spacing={40}>
              <SentVsReceivedChart
                title={titleFormatter({
                  titleName: 'Total Sent vs Received',
                  filters,
                })}
                description={descriptionFormatter({
                  description: isGlobalContextLoading ? `` : daysAgoDescription,
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
              <FriendsOverTimeChart
                title={['Top 5 Friends Over Time']}
                description="excludes group chats"
                icon={FiUsers}
                filters={filters}
              />
            </Stack>
          </TabPanel>
          <TabPanel>
            <Stack direction="column" spacing={40}>
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
                isPremiumGraph
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
                isPremiumGraph
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
                isPremiumGraph
              />
            </Stack>
          </TabPanel>
          <TabPanel>
            <GroupChatTab filters={filters} />
          </TabPanel>
          <TabPanel>
            <Stack direction="column" spacing={40}>
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
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
