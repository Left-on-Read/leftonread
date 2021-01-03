import React, { Fragment, useState, useEffect } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import './app.global.css';
import { coreInit } from './utils/initUtils';
import { interpolateCool } from 'd3-scale-chromatic'

import BarChart from './components/charts/BarChart';
import { ChatTableNames } from './tables';
import * as chatBro from './chatBro';

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
        <BarChart
          db={db}
          titleText='Top Words Sent'
          subLabel='Count of Word'
          chartQuery={() =>
            chatBro.queryWordCounts(
              db,
              ChatTableNames.WORD_TABLE,
              {isFromMe: true}
            )
          }
          xAxisKey={'word'}
          colorInterpolationFunc={interpolateCool}
        />
        <BarChart
          db={db}
          titleText='Top Friends'
          subLabel='Count of Text'
          chartQuery={() =>
            chatBro.queryTopFriends(
              db,
              ChatTableNames.TOP_FRIENDS_TABLE
            )
          }
          xAxisKey={'friend'}
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
