import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { render } from 'react-dom';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import './app.global.css';
import { interpolateCool } from 'd3-scale-chromatic';
import { coreInit } from './utils/initUtils';
import LimitFilter from './components/filters/LimitFilter';

import WordOrEmojiCountChart from './components/charts/WordOrEmojiCountChart';
import TopFriendsChart from './components/charts/TopFriendsChart';

export default function Root() {
  const [db, setDB] = useState<sqlite3.Database | null>(null);
  const [limit, setLimit] = useState(15);

  useEffect(() => {
    async function createInitialLoad() {
      try {
        const lorDB = await coreInit();
        setDB(lorDB);
      } catch (err) {
        log.error('ERROR SETTING UP DB/tables ', err);
      }
    }
    createInitialLoad();
  }, []);

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(Number(event.target.value));
  };

  if (db) {
    return (
      <div>
        <LimitFilter handleChange={handleLimitChange} limit={limit} />
        <WordOrEmojiCountChart
          db={db}
          titleText="Top Words"
          labelText="Count of Word"
          filters={{ isEmoji: false, limit, isFromMe: true }}
          colorInterpolationFunc={interpolateCool}
        />
        <TopFriendsChart
          db={db}
          titleText="Top Friends"
          filters={{ limit }}
          colorInterpolationFunc={interpolateCool}
        />
        <WordOrEmojiCountChart
          db={db}
          titleText="Top Emojis"
          labelText="Count of Emoji"
          filters={{ isEmoji: true, limit, isFromMe: true }}
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
