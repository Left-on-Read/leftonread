import React, { Fragment, useState, useEffect } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import './app.global.css';
import * as sqlite3 from 'sqlite3';
import {
  dropAllExistingTables,
  createAllTables,
} from './chatBro';
import { CopyCaptain } from './copyCaptain';
import WordCountChart from './components/charts/WordCount';

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

export default function Root() {
  const [db, setDB] = useState<sqlite3.Database | null>(null);

  useEffect(() => {
    async function createInitialLoad() {
      try {
        let copyCaptain = new CopyCaptain();
        const initialDB = await copyCaptain.init();
        await dropAllExistingTables(initialDB);
        await createAllTables(initialDB);
        setDB(initialDB);
      } catch (err) {
        console.log('ERROR SETTING UP DB/tables ', err);
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
