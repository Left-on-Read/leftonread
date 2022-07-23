import log from 'electron-log';
import * as _ from 'lodash';
import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../utils/initUtils/sqliteWrapper';
import { ChatCountTable } from './Chat/Count';
import { ContactTable } from './ContactTable';
import { CoreMainTable } from './Core/Main';
import {
  AddressBookTableNames,
  ChatTableNames,
  CoreTableNames,
} from './definitions';

const chatTableNames: string[] = _.values(ChatTableNames);

export async function createContactTable(
  db: sqlite3.Database
): Promise<AddressBookTableNames[]> {
  const tables = [new ContactTable(db, AddressBookTableNames.CONTACT_TABLE)];

  const createTablePromises = tables.map((table) => table.create());
  log.info(`INFO: ${AddressBookTableNames.CONTACT_TABLE}successfully created`);
  return Promise.all(createTablePromises) as Promise<AddressBookTableNames[]>;
}

export async function createCoreMainTables(
  db: sqlite3.Database
): Promise<CoreTableNames[]> {
  const tables = [new CoreMainTable(db, CoreTableNames.CORE_MAIN_TABLE)];

  const createTablePromises = tables.map((table) => table.create());
  log.info(`INFO: ${CoreTableNames.CORE_MAIN_TABLE} successfully created`);
  return Promise.all(createTablePromises) as Promise<CoreTableNames[]>;
}

export async function createAllChatTables(
  db: sqlite3.Database
): Promise<ChatTableNames[]> {
  // NOTE: CORE_MAIN needs to be created first
  // because COUNT_TABLE depends on it
  const tables = [new ChatCountTable(db, ChatTableNames.COUNT_TABLE)];

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
