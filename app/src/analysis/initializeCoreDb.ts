import log from 'electron-log';
import * as fs from 'fs';
import recursiveCopy from 'recursive-copy';
import * as sqlite3 from 'sqlite3';

import {
  addContactNameColumn,
  ContactTable,
  findPossibleAddressBookDB,
  setContactNameColumn,
} from './tables/ContactTable';
import { closeDB, initializeDB } from 'utils/db';

import {
  addressBookDBAliasName,
  appDirectoryInitPath,
  appDirectoryPath,
  chatPaths,
  dirPairings,
} from './directories';
import * as sqlite3Wrapper from '../utils/sqliteWrapper';
import { CoreMainTable } from './tables/CoreTable';
import {
  AddressBookTableNames,
  ChatTableNames,
  CoreTableNames,
} from './tables/types';
import { ChatCountTable } from './tables/ChatTable';

async function createAppDirectory() {
  try {
    if (!fs.existsSync(appDirectoryPath)) {
      fs.mkdirSync(appDirectoryPath);
      fs.mkdirSync(appDirectoryInitPath);
      log.info('INFO: createAppDirectory success');
    }
  } catch (e) {
    log.error(`ERROR: ${e}`);
  }
}

async function dropAllTables(db: sqlite3.Database) {
  const dropTablePromises = [
    ...Object.values(ChatTableNames),
    ...Object.values(CoreMainTable),
  ].map(async (tableName) =>
    sqlite3Wrapper.runP(db, `DROP TABLE IF EXISTS ${tableName}`)
  );

  return Promise.all(dropTablePromises);
}
// TODO: logic could be added here depending on what user wants to update their chat.db
export async function initializeCoreDb(): Promise<sqlite3.Database> {
  log.info('Attempting to create core tables...');

  await createAppDirectory();
  if (process.env.DEBUG_ENV) {
    await Promise.all(
      dirPairings.map(async (obj) =>
        recursiveCopy(obj.debug, obj.app, {
          overwrite: true,
        })
      )
    );
  } else {
    await Promise.all(
      dirPairings.map(async (obj) =>
        recursiveCopy(obj.original, obj.app, {
          overwrite: true,
        })
      )
    );
  }
  const possibleAddressBookDB = await findPossibleAddressBookDB();
  const lorDB = initializeDB(chatPaths.app);
  await dropAllTables(lorDB);

  log.info('Dropped all tables.');

  // Create contact table
  if (possibleAddressBookDB) {
    try {
      await new ContactTable(
        lorDB,
        AddressBookTableNames.CONTACT_TABLE
      ).create();

      // @ts-ignore
      const q = `ATTACH '${possibleAddressBookDB.filename}' AS ${addressBookDBAliasName}`;
      await sqlite3Wrapper.runP(lorDB, q);
      await addContactNameColumn(lorDB);
      await setContactNameColumn(lorDB);
      closeDB(possibleAddressBookDB); // after setContactNameColumn, we have no use for this db
    } catch (e) {
      log.error(e);
    }
  }

  // Create Tables
  await new CoreMainTable(lorDB, CoreTableNames.CORE_MAIN_TABLE).create();
  await new ChatCountTable(lorDB, ChatTableNames.COUNT_TABLE).create();
  log.info('Created LOR DB');

  return lorDB;
}
