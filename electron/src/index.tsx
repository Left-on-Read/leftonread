import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { render } from 'react-dom';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import './app.global.css';
import { interpolateCool } from 'd3-scale-chromatic';
import { coreInit } from './utils/initUtils';

import WordCountChart from './components/charts/WordCountChart';
import TopFriendsChart from './components/charts/TopFriendsChart';

export default function Root() {
  const [db, setDB] = useState<sqlite3.Database | null>(null);

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

  if (db) {
    return (
      <div>
        <WordCountChart
          db={db}
          titleText="Top Words"
          labelText="Count of Word"
          isEmoji={false}
          colorInterpolationFunc={interpolateCool}
        />
        <TopFriendsChart
          db={db}
          titleText="Top Friends"
          colorInterpolationFunc={interpolateCool}
        />
        <WordCountChart
          db={db}
          titleText="Top Emojis"
          labelText="Count of Emoji"
          isEmoji
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
