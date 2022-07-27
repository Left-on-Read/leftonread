import { useCoreDb } from 'analysis/useCoreDb';
import WordOrEmojiCountChart from 'components/Graphs/WordOrEmojiCountChart';
import { DEFAULT_FILTER_LIMIT } from 'constants/index';
import { GroupChatFilters } from 'constants/filters';
import { interpolateCool } from 'd3-scale-chromatic';
import { useState } from 'react';
import log from 'electron-log';
import { TopFriendsChart } from 'components/Graphs/TopFriendsChart';

export function Dashboard() {
  const { isLoading, error, data: coreDb } = useCoreDb();

  const [limit, setLimit] = useState<number>(DEFAULT_FILTER_LIMIT);
  const [groupChat, setGroupChat] = useState<GroupChatFilters>(
    GroupChatFilters.ONLY_INDIVIDUAL
  );
  const [contact, setContact] = useState<string | undefined>(undefined);

  //   const handleContactChange = (selected?: IContactData | null | undefined) => {
  //     setContact(selected?.value);
  //   };

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(Number(event.target.value));
  };

  const handleGroupChatChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGroupChat(event.target.value as GroupChatFilters);
  };

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!coreDb) {
    log.info(coreDb);
    return <div> Missing Core DB </div>;
  }

  return (
    <div>
      <WordOrEmojiCountChart
        db={coreDb}
        titleText="Top Received Emojis"
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
        db={coreDb}
        titleText="Top Received Words"
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
      <TopFriendsChart
        db={coreDb}
        titleText="Top Friends"
        filters={{ limit, groupChat, contact }}
        colorInterpolationFunc={interpolateCool}
      />
      <WordOrEmojiCountChart
        db={coreDb}
        titleText="Top Sent Words"
        labelText="Count of Word"
        filters={{ isEmoji: false, limit, isFromMe: true, contact }}
        colorInterpolationFunc={interpolateCool}
      />
      <WordOrEmojiCountChart
        db={coreDb}
        titleText="Top Sent Emojis"
        labelText="Count of Emoji"
        filters={{ isEmoji: true, limit, isFromMe: true, contact }}
        colorInterpolationFunc={interpolateCool}
      />
    </div>
  );
}
