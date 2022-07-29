import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { interpolateCool } from 'd3-scale-chromatic';
import { useState } from 'react';

import { DEFAULT_FILTER_LIMIT } from '../../constants';
import { GroupChatFilters } from '../../constants/filters';
import { TopFriendsChart } from '../Graphs/TopFriendsChart';
import { WordOrEmojiCountChart } from '../Graphs/WordOrEmojiCountChart';

export function ChartTabs() {
  const [limit, setLimit] = useState<number>(DEFAULT_FILTER_LIMIT);
  const [groupChat, setGroupChat] = useState<GroupChatFilters>(
    GroupChatFilters.ONLY_INDIVIDUAL
  );
  const [contact, setContact] = useState<string | undefined>(undefined);

  return (
    <Tabs variant="soft-rounded" colorScheme="purple" size="md">
      <TabList
        style={{
          position: 'fixed',
          backgroundColor: 'white',
          paddingBottom: 24,
          width: '100%',
          background:
            'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 25%, rgba(255,255,255,1) 100%)',
        }}
      >
        <Tab style={{ marginRight: 32 }}>Trends</Tab>
        <Tab style={{ marginRight: 32 }}>Words & Emojis</Tab>
        <Tab style={{ marginRight: 32 }}>Sentiments</Tab>
      </TabList>
      <TabPanels style={{ paddingTop: 60 }}>
        <TabPanel>
          <div>
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
              colorInterpolationFunc={interpolateCool}
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
              colorInterpolationFunc={interpolateCool}
            />
          </div>
        </TabPanel>
        <TabPanel>
          <div>
            <TopFriendsChart
              title="Top Friends"
              description="The friends you text the most"
              filters={{ limit, groupChat, contact }}
              colorInterpolationFunc={interpolateCool}
            />
            <WordOrEmojiCountChart
              title="Top Sent Words"
              description="The most common words you sent"
              labelText="Count of Word"
              filters={{ isEmoji: false, limit, isFromMe: true, contact }}
              colorInterpolationFunc={interpolateCool}
            />
          </div>
        </TabPanel>
        <TabPanel>
          <WordOrEmojiCountChart
            title="Top Sent Emojis"
            description="The most commonly sent emojis"
            labelText="Count of Emoji"
            filters={{ isEmoji: true, limit, isFromMe: true, contact }}
            colorInterpolationFunc={interpolateCool}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
