import log from 'electron-log';
import * as fs from 'fs';
import recursiveCopy from 'recursive-copy';
import * as sqlite3 from 'sqlite3';

import { closeDB, initializeDB } from '../utils/db';
import * as sqlite3Wrapper from '../utils/sqliteWrapper';
import {
  addressBookDBAliasName,
  appDirectoryInitPath,
  appDirectoryPath,
  chatPaths,
  dirPairings,
} from './directories';
import { CalendarTable } from './tables/CalendarTable';
import { ChatCountTable } from './tables/ChatTable';
import {
  addContactNameColumn,
  ContactTable,
  findPossibleAddressBookDB,
  setContactNameColumn,
} from './tables/ContactTable';
import { CoreMainTable } from './tables/CoreTable';
import {
  AddressBookTableNames,
  CalendarTableNames,
  ChatTableNames,
  CoreTableNames,
} from './tables/types';

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
    ...Object.values(AddressBookTableNames),
    ...Object.values(CalendarTableNames),
  ].map(async (tableName) =>
    sqlite3Wrapper.runP(db, `DROP TABLE IF EXISTS ${tableName}`)
  );

  log.info('INFO: Dropped all pre-existing LOR-created tables.');
  return Promise.all(dropTablePromises);
}

export async function initializeCoreDb(): Promise<sqlite3.Database> {
  log.info(
    `INFO: Copying a chat.db and address book files from the user's library into a .leftonread folder`
  );

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

  // Drop everything LOR specific if it exists
  await dropAllTables(lorDB);

  // Add the contact name column regardless
  // It will just be empty if we don't find an address book db table
  // As a result, we can use COALESCE(contact_name, id)
  await addContactNameColumn(lorDB);

  // If we found an address book table, let's create a contact_table and attach it to the main lorDB.
  if (possibleAddressBookDB) {
    try {
      // Create contact table takes the possibleAddressBookDB not the LOR DB
      await new ContactTable(
        possibleAddressBookDB,
        AddressBookTableNames.CONTACT_TABLE
      ).create();

      // @ts-ignore
      const q = `ATTACH '${possibleAddressBookDB.filename}' AS ${addressBookDBAliasName}`;
      await sqlite3Wrapper.runP(lorDB, q);
      await setContactNameColumn(lorDB);
      closeDB(possibleAddressBookDB); // after setContactNameColumn, we have no use for the address book db
    } catch (e) {
      log.error(e);
    }
  }

  const calTable = new CalendarTable(
    lorDB,
    CalendarTableNames.CALENDAR_TABLE
  ).create();
  const coreMainTable = new CoreMainTable(
    lorDB,
    CoreTableNames.CORE_MAIN_TABLE
  ).create();
  await Promise.all([calTable, coreMainTable]);

  await new ChatCountTable(lorDB, ChatTableNames.COUNT_TABLE).create();

  log.info('INFO: Created LOR DB');

  return lorDB;
}
