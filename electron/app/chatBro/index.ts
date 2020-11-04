import * as _ from 'lodash';
import * as sqlite3 from 'sqlite3';
import { settleAll } from 'blend-promise-utils';
import { createWordTable, getWordCount } from './queries/wordCount';
import * as sqlite3Wrapper from './util/sqliteWrapper';
import { ChatBro } from './definitions';

const tableNames: string[] = _.values(ChatBro.Tables);

// TODO(Danilowicz): I think this should be a Class with an init method?

// TODO: where all other table creation will live
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

export {
  dropAllExistingTables,
  createAllTables,
  getWordCount,
  tables,
};
