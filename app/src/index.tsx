import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { render } from 'react-dom';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import './app.global.css';
import { interpolateCool } from 'd3-scale-chromatic';
import { coreInit, getContactOptions } from './utils/initUtils';
import LimitFilter from './components/filters/LimitFilter';
import { DEFAULT_LIMIT, GroupChatFilters } from './chatBro/constants/filters';
import GroupChatFilter from './components/filters/GroupChatFilter';
import ContactFilter from './components/filters/ContactFilter';

import WordOrEmojiCountChart from './components/charts/WordOrEmojiCountChart';
import TopFriendsChart from './components/charts/TopFriendsChart';

export default function Root() {
  const [db, setDB] = useState<sqlite3.Database | null>(null);
  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);
  const [groupChat, setGroupChat] = useState<GroupChatFilters>(
    GroupChatFilters.ONLY_INDIVIDUAL
  );
  const [contact, setContact] = useState(undefined);
  const [contactOptions, setContactOptions] = useState([]);

  useEffect(() => {
    async function createInitialLoad() {
      try {
        const lorDB = await coreInit();
        setDB(lorDB);
        const allContacts = await getContactOptions(lorDB);
        setContactOptions(allContacts);
      } catch (err) {
        log.error('ERROR SETTING UP DB/tables ', err);
      }
    }
    createInitialLoad();
  }, []);

  // TODO(danilowicz): remove usage of 'any'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleContactChange = (selected?: any) => {
    if (selected !== null) {
      setContact(selected.value);
    } else {
      setContact(undefined);
    }
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
            options={contactOptions}
            contact={contact}
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

render(
  <Router>
    <Switch>
      <Route path="/" component={Root} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
