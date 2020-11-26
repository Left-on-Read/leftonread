<<<<<<< HEAD
export * from './db'
export * from './tables'
export * from './queries'
=======
import * as _ from 'lodash';
import * as sqlite3 from 'sqlite3';
import { settleAll } from 'blend-promise-utils';
import { createWordTable, getWordCount } from './queries/wordCount';
import * as sqlite3Wrapper from './util/sqliteWrapper';
import { ChatBro } from './definitions';

const tableNames: string[] = _.values(ChatBro.Tables);

// where all other table creation will live
async function createAllTables(db: sqlite3.Database) {
  return createWordTable(db);
}

async function dropAllExistingTables(db: sqlite3.Database) {
  const dropTablePromises = tableNames.map(async (tableName) =>
    sqlite3Wrapper.runP(db, `DROP TABLE IF EXISTS ${tableName}`)
  );
  return settleAll(dropTablePromises);
}

const tables = ChatBro.Tables;

export { dropAllExistingTables, createAllTables, getWordCount, tables };
>>>>>>> 1d3aec24911c7be053d2c9187062f49d544d89e3
