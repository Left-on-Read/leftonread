import '../app.global.css';

import { interpolateCool } from 'd3-scale-chromatic';
import log from 'electron-log';
import React, { useEffect, useState } from 'react';
import * as sqlite3 from 'sqlite3';

import { DEFAULT_LIMIT, GroupChatFilters } from '../chatBro/constants/filters';
import { coreInit } from '../utils/initUtils';
import { IContactData } from '../utils/initUtils/contacts/types';
import TopFriendsChart from './charts/TopFriendsChart';
import WordOrEmojiCountChart from './charts/WordOrEmojiCountChart';
import ContactFilter from './filters/ContactFilter';
import GroupChatFilter from './filters/GroupChatFilter';
import LimitFilter from './filters/LimitFilter';

export function Dashboard() {
  const [db, setDB] = useState<sqlite3.Database | null>(null);
  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);
  const [groupChat, setGroupChat] = useState<GroupChatFilters>(
    GroupChatFilters.ONLY_INDIVIDUAL
  );
  const [contact, setContact] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function createInitialLoad() {
      try {
        const lorDB = await coreInit();
        setDB(lorDB);
      } catch (err) {
        log.error('ERROR: fetching app data', err);
      }
    }
    createInitialLoad();
  }, []);

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

  if (db) {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <LimitFilter handleChange={handleLimitChange} limit={limit} />
          <GroupChatFilter
            handleChange={handleGroupChatChange}
            groupChat={groupChat}
          />
          <ContactFilter
            db={db}
            contact={{
              value: contact,
            }}
            handleChange={handleContactChange}
          />
        </div>
        <WordOrEmojiCountChart
          db={db}
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
          db={db}
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
          db={db}
          titleText="Top Friends"
          filters={{ limit, groupChat, contact }}
          colorInterpolationFunc={interpolateCool}
        />
        <WordOrEmojiCountChart
          db={db}
          titleText="Top Sent Words"
          labelText="Count of Word"
          filters={{ isEmoji: false, limit, isFromMe: true, contact }}
          colorInterpolationFunc={interpolateCool}
        />
        <WordOrEmojiCountChart
          db={db}
          titleText="Top Sent Emojis"
          labelText="Count of Emoji"
          filters={{ isEmoji: true, limit, isFromMe: true, contact }}
          colorInterpolationFunc={interpolateCool}
        />
      </div>
    );
  }
  return <div>Loading dash... </div>;
}
