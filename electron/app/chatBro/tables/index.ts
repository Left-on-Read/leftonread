import * as _ from 'lodash'
import * as sqlite3 from 'sqlite3'
import * as sqlite3Wrapper from '../util/sqliteWrapper'

import { WordCountTable } from './WordCount'
import { TableNames } from './definitions'

const tableNames: string[] = _.values(TableNames);

export async function createAllTables(db: sqlite3.Database): Promise<TableNames[]> {
  const tables = [
    new WordCountTable(db, TableNames.WORD_TABLE),
  ]

  const createTablePromises = tables.map(table => table.create())
  return Promise.all(createTablePromises)
}

export async function dropAllTables(db: sqlite3.Database) {
  const dropTablePromises = tableNames.map(async (tableName) =>
    sqlite3Wrapper.runP(db, `DROP TABLE IF EXISTS ${tableName}`)
  );
  return Promise.all(dropTablePromises);
}

export {
  WordCountTable,
  TableNames,
}
