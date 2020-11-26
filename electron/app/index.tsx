import React, { Fragment, useState, useEffect } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import './app.global.css';
import { initializeDB, createAllTables, dropAllTables } from './chatBro';
import WordCountChart from './components/charts/WordCount';
import { initChatFiles } from './utils/initUtils/initUtils';
import { appChatDBDirectoryPath } from './utils/initUtils/constants/directories';

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

export default function Root() {
  const [db, setDB] = useState<sqlite3.Database | null>(null);

  useEffect(() => {
    async function createInitialLoad() {
      try {
        await initChatFiles();
        const chatDB = initializeDB(appChatDBDirectoryPath);
        await dropAllTables(chatDB);
        await createAllTables(chatDB);
        setDB(chatDB);
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
