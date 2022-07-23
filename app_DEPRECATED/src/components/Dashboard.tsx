import '../app.global.css';

import { interpolateCool } from 'd3-scale-chromatic';
import React, { useState } from 'react';

import { DEFAULT_LIMIT, GroupChatFilters } from '../chatBro/constants/filters';
import { useCoreDb } from '../hooks/useCoreDb';
import { IContactData } from '../utils/initUtils/contacts/types';
import TopFriendsChart from './charts/TopFriendsChart';
import WordOrEmojiCountChart from './charts/WordOrEmojiCountChart';
import ContactFilter from './filters/ContactFilter';
import GroupChatFilter from './filters/GroupChatFilter';
import LimitFilter from './filters/LimitFilter';
import { LoadingPage } from './pages/LoadingPage';

export function Dashboard() {
  const { isLoading, error, data } = useCoreDb();
  const coreDb = data;

  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);
  const [groupChat, setGroupChat] = useState<GroupChatFilters>(
    GroupChatFilters.ONLY_INDIVIDUAL
  );
  const [contact, setContact] = useState<string | undefined>(undefined);

  const handleContactChange = (selected?: IContactData | null | undefined) => {
    setContact(selected?.value);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(Number(event.target.value));
  };

  const handleGroupChatChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGroupChat(event.target.value as GroupChatFilters);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (coreDb) {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <LimitFilter handleChange={handleLimitChange} limit={limit} />
          <GroupChatFilter
            handleChange={handleGroupChatChange}
            groupChat={groupChat}
          />
          <ContactFilter
            db={coreDb}
            contact={{
              value: contact,
            }}
            handleChange={handleContactChange}
          />
        </div>
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

  return (
    <div>
      Something went wrong... Error: {error instanceof Error && error.message}
    </div>
  );
}
