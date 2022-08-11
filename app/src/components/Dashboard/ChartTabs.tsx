import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';

import { EarliestAndLatestDateResults } from '../../analysis/queries/EarliestAndLatestDatesQuery';
import { DEFAULT_FILTER_LIMIT } from '../../constants';
import { GroupChatFilters } from '../../constants/filters';
import { daysAgo } from '../../main/util';
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
          <Tab style={{ marginRight: 32 }}>Trends</Tab>
          <Tab style={{ marginRight: 32 }}>Words & Emojis</Tab>
          <Tab style={{ marginRight: 32 }}>Sentiments</Tab>
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
                filters={{
                  groupChat,
                  contact,
                }}
              />
              <WordOrEmojiCountChart
                title="Top Received Emojis"
                description="The most received Emojis"
                labelText="Count of Emoji"
                filters={{
                  isEmoji: true,
                  limit,
                  isFromMe: false,
                  groupChat,
                  contact,
                }}
              />
              <WordOrEmojiCountChart
                title="Top Received Words"
                description="The most received words"
                labelText="Count of Word"
                filters={{
                  isEmoji: false,
                  limit,
                  isFromMe: false,
                  groupChat,
                  contact,
                }}
              />
              <TextsOverTimeChart
                title="Number of Texts Per Day"
                description=""
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
              <TopFriendsChart
                title="Top Friends"
                description="The friends you text the most"
                filters={{ limit, groupChat, contact }}
              />
              <WordOrEmojiCountChart
                title="Top Sent Words"
                description="The most common words you sent"
                labelText="Count of Word"
                filters={{ isEmoji: false, limit, isFromMe: true, contact }}
              />
            </div>
          </TabPanel>
          <TabPanel>
            <WordOrEmojiCountChart
              title="Top Sent Emojis"
              description="The most commonly sent emojis"
              labelText="Count of Emoji"
              filters={{ isEmoji: true, limit, isFromMe: true, contact }}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
