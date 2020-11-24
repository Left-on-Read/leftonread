import React, { Fragment, useState, useEffect } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import './app.global.css';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import { dropAllExistingTables, createAllTables } from './chatBro';
import init from './utils/initUtils/initUtils';
import WordCountChart from './components/charts/WordCount';

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

export default function Root() {
  const [db, setDB] = useState<sqlite3.Database | null>(null);

  useEffect(() => {
    async function createInitialLoad() {
      try {
        const initialDB = await init();
        await dropAllExistingTables(initialDB);
        await createAllTables(initialDB);
        setDB(initialDB);
      } catch (err) {
        log.error('ERROR SETTING UP DB/tables ', err);
      }
    }
    createInitialLoad();
  }, []);

  if (db) {
    return (
      <div>
        <WordCountChart db={db} />
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
