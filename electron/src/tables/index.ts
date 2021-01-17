import * as _ from 'lodash';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import * as sqlite3Wrapper from '../utils/initUtils/sqliteWrapper';
import { ContactTable } from './ContactTable';
import { CoreCountTable } from './Core/Count';

import { AddressBookTableNames, ChatTableNames } from './definitions';

const chatTableNames: string[] = _.values(ChatTableNames);

export async function createContactTable(
  db: sqlite3.Database
): Promise<AddressBookTableNames[]> {
  const tables = [new ContactTable(db, AddressBookTableNames.CONTACT_TABLE)];

  const createTablePromises = tables.map((table) => table.create());
  log.info('Contact table successfully created');
  return Promise.all(createTablePromises) as Promise<AddressBookTableNames[]>;
}

export async function createAllChatTables(
  db: sqlite3.Database
): Promise<ChatTableNames[]> {
  const tables = [new CoreCountTable(db, ChatTableNames.CORE_COUNT_TABLE)];

  const createTablePromises = tables.map((table) => table.create());
  return Promise.all(createTablePromises) as Promise<ChatTableNames[]>;
}

export async function dropAllChatTables(db: sqlite3.Database) {
  const dropTablePromises = chatTableNames.map(async (tableName) =>
    sqlite3Wrapper.runP(db, `DROP TABLE IF EXISTS ${tableName}`)
  );
  return Promise.all(dropTablePromises);
}

export { ChatTableNames, AddressBookTableNames };
