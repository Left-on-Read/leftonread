import React, { Fragment, useState, useEffect } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import './app.global.css';
import { interpolateCool } from 'd3-scale-chromatic';
import { coreInit } from './utils/initUtils';

import WordCountChart from './components/charts/WordCountChart';
import TopFriendsChart from './components/charts/TopFriendsChart';
import { ChatTableNames } from './tables';

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

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
          tableName={ChatTableNames.WORD_TABLE}
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
          tableName={ChatTableNames.EMOJI_TABLE}
          colorInterpolationFunc={interpolateCool}
        />
      </div>
    );
  }
  return <div>Loading dash... </div>;
}

document.addEventListener('DOMContentLoaded', () =>
  render(
    <AppContainer>
      <Root />
    </AppContainer>,
    document.getElementById('root')
  )
);
