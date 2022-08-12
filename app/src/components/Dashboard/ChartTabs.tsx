import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import {
  FiBookOpen,
  FiCalendar,
  FiEdit3,
  FiMeh,
  FiMessageCircle,
  FiSmile,
  FiUsers,
} from 'react-icons/fi';

import { EarliestAndLatestDateResults } from '../../analysis/queries/EarliestAndLatestDatesQuery';
import { DEFAULT_FILTER_LIMIT } from '../../constants';
import { GroupChatFilters } from '../../constants/filters';
import { daysAgo } from '../../main/util';
import { ComingSoon } from '../ComingSoon';
import { SentVsReceivedChart } from '../Graphs/SentVsReceivedChart';
import { TextsOverTimeChart } from '../Graphs/TextsOverTimeChart';
import { TopFriendsChart } from '../Graphs/TopFriendsChart';
import { WordOrEmojiCountChart } from '../Graphs/WordOrEmojiCountChart';

export function ChartTabs() {
  const [limit, setLimit] = useState<number>(DEFAULT_FILTER_LIMIT);
  const [groupChat, setGroupChat] = useState<GroupChatFilters>(
    GroupChatFilters.ONLY_INDIVIDUAL
  );
  const [contact, setContact] = useState<string | undefined>(undefined);

  const [earliestAndLatestDate, setEarliestAndLatestDates] = useState<{
    earliestDate: Date;
    latestDate: Date;
  }>();

  // TODO(Danilowicz): Possibly move this to electron-store?
  useEffect(() => {
    async function fetchEarliestAndLatestDates() {
      try {
        const datesDataList: EarliestAndLatestDateResults =
          await ipcRenderer.invoke('query-earliest-and-latest-dates');
        if (datesDataList && datesDataList.length === 1) {
          const earlyDate = datesDataList[0].earliest_date;
          const lateDate = datesDataList[0].latest_date;
          setEarliestAndLatestDates({
            earliestDate: new Date(earlyDate),
            latestDate: new Date(lateDate),
          });
        }
      } catch (err) {
        log.error(`ERROR: fetching for fetchEarliestAndLatestDates`, err);
      }
    }
    fetchEarliestAndLatestDates();
  }, []);

  return (
    <div>
      {/* <span>
        Last text message: {earliestAndLatestDate?.latestDate.toLocaleString()}
      </span> */}
      <Tabs variant="soft-rounded" colorScheme="purple" size="md">
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
          <Tab style={{ marginRight: 32 }}>
            <span style={{ marginRight: 10 }}>📱</span> Activity
          </Tab>
          <Tab style={{ marginRight: 32 }}>
            <span style={{ marginRight: 10 }}>😃</span>Words & Emojis
          </Tab>
          <Tab style={{ marginRight: 32 }}>
            <span style={{ marginRight: 10 }}>🚀</span>Coming Soon
          </Tab>
        </TabList>
        <TabPanels style={{ paddingTop: 60 }}>
          <TabPanel>
            <div>
              <SentVsReceivedChart
                title="Total Sent vs Received"
                description={
                  earliestAndLatestDate
                    ? `since ${earliestAndLatestDate.earliestDate.toLocaleDateString()} (${daysAgo(
                        earliestAndLatestDate.earliestDate,
                        new Date()
                      )} days ago)`
                    : 'since...'
                }
                icon={FiMessageCircle}
                filters={{
                  groupChat,
                  contact,
                }}
              />
              <TopFriendsChart
                title="Top Messaged Friends"
                description=""
                icon={FiUsers}
                filters={{ limit, groupChat, contact }}
              />
              <TextsOverTimeChart
                title="Number of Messages Per Day"
                description=""
                icon={FiCalendar}
                filters={{
                  limit,
                  groupChat,
                  contact,
                }}
              />
            </div>
          </TabPanel>
          <TabPanel>
            <div>
              <WordOrEmojiCountChart
                title="Top Received Emojis"
                description=""
                icon={FiSmile}
                labelText="Count of Received Emojis"
                filters={{
                  isEmoji: true,
                  limit,
                  isFromMe: false,
                  groupChat: GroupChatFilters.BOTH,
                  contact,
                }}
              />
              <WordOrEmojiCountChart
                title="Top Sent Emojis"
                description=""
                icon={FiMeh}
                labelText="Count of Sent Emojis"
                filters={{
                  isEmoji: true,
                  limit,
                  isFromMe: true,
                  contact,
                  groupChat,
                }}
              />
              <WordOrEmojiCountChart
                title="Top Received Words"
                description=""
                icon={FiBookOpen}
                labelText="Count of Received Words"
                filters={{
                  isEmoji: false,
                  limit,
                  isFromMe: false,
                  groupChat,
                  contact,
                }}
              />
              <WordOrEmojiCountChart
                title="Top Sent Words"
                description=""
                icon={FiEdit3}
                labelText="Count of Sent Words"
                filters={{
                  isEmoji: false,
                  limit,
                  isFromMe: true,
                  contact,
                  groupChat,
                }}
              />
            </div>
          </TabPanel>
          <TabPanel>
            <ComingSoon />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
