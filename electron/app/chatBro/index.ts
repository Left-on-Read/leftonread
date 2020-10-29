import * as sqlite3 from 'sqlite3';
import { settleAll } from 'blend-promise-utils';
import { createWordTable, getWordCount } from './queries/wordCount';
import * as sqlite3Wrapper from './util/sqliteWrapper';

// TODO: this should be imported and be of type word_table
const tableNames: string[] = ['word_table'];

function initializeDB() {
  const sqldb = sqlite3.verbose();
  const db = new sqldb.Database(`${process.env.HOME}/Desktop/chat.db`);
  return db;
}

function closeDB(db: sqlite3.Database) {
  db.close();
}

// TODO: where all other table creation where live
async function createAllTables(db: sqlite3.Database) {
  return createWordTable(db, 'word_table');
}

async function dropAllExistingTables(db: sqlite3.Database) {
  const dropTablePromises = tableNames.map(async (tableName) =>
    sqlite3Wrapper.runP(db, `DROP TABLE IF EXISTS ${tableName}`)
  );
  return settleAll(dropTablePromises);
}

export {
  initializeDB,
  closeDB,
  dropAllExistingTables,
  createAllTables,
  getWordCount,
};
