import log from 'electron-log';
import * as fs from 'fs';
import recursiveCopy from 'recursive-copy';
import * as sqlite3 from 'sqlite3';

import {
  addressBookDBAliasName,
  addressBookDBName,
  appDirectoryLivePath,
  liveAddBookBackUpFolderPath,
  liveAddressBookPaths,
  liveChatPaths,
  liveDirPairings,
} from '../../analysis/directories';
import {
  addContactNameColumn,
  ContactTable,
  COUNT_CONTACTS_QUERY,
  setContactNameColumn,
} from '../../analysis/tables/ContactTable';
import { CoreMainTable } from '../../analysis/tables/CoreTable';
import {
  AddressBookTableNames,
  CoreTableNames,
} from '../../analysis/tables/types';
import {
  closeDB,
  DBWithRecordCount,
  getDBWithRecordCounts,
  initializeDB,
} from '../../utils/db';
import * as sqlite3Wrapper from '../../utils/sqliteWrapper';

async function clearLiveDirectory() {
  if (fs.existsSync(appDirectoryLivePath)) {
    fs.rmSync(`${appDirectoryLivePath}`, { recursive: true });
  }
}

async function createLiveDirectory() {
  try {
    if (!fs.existsSync(appDirectoryLivePath)) {
      fs.mkdirSync(appDirectoryLivePath);
      log.info('INFO: createAppDirectory success');
    }
  } catch (e) {
    log.error(`ERROR: ${e}`);
  }
}

async function dropAllTables(db: sqlite3.Database) {
  const dropTablePromises = [
    ...Object.values(CoreMainTable),
    ...Object.values(AddressBookTableNames),
  ].map(async (tableName) =>
    sqlite3Wrapper.runP(db, `DROP TABLE IF EXISTS ${tableName}`)
  );

  await Promise.all(dropTablePromises);
  log.info('INFO: Dropped all pre-existing LOR-created tables.');
}

async function liveFindPossibleAddressBookDB(): Promise<
  sqlite3.Database | undefined
> {
  let dbRecordCountResults: DBWithRecordCount[] = [];

  // If there was a top level address db exists, read that
  const initialDBPath = `${liveAddressBookPaths.app}/${addressBookDBName}`;
  const initialAddressBookDBRecordCount = await getDBWithRecordCounts(
    initialDBPath,
    COUNT_CONTACTS_QUERY
  );
  if (
    initialAddressBookDBRecordCount &&
    initialAddressBookDBRecordCount.recordCount > 0
  ) {
    dbRecordCountResults.push(initialAddressBookDBRecordCount);
  }

  // If backup files exists, read those as well
  if (fs.existsSync(liveAddBookBackUpFolderPath)) {
    log.info(`INFO: ${liveAddBookBackUpFolderPath} exists`);
    const filenames = fs.readdirSync(liveAddBookBackUpFolderPath);

    const promises = filenames.map(async (file) => {
      const path = `${liveAddBookBackUpFolderPath}/${file}/${addressBookDBName}`;
      return getDBWithRecordCounts(path, COUNT_CONTACTS_QUERY);
    });
    const resolvedDbRecordCounts = await Promise.all(promises);
    dbRecordCountResults = dbRecordCountResults.concat(resolvedDbRecordCounts);
  }

  // If either top level or backup dbs exist
  if (dbRecordCountResults.length > 0) {
    // find one with biggest record counts
    const maxDB = dbRecordCountResults.reduce((a, b) =>
      a.recordCount > b.recordCount ? a : b
    );
    log.info(
      `INFO: Returning Address Book DB with ${maxDB.recordCount} records`
    );
    return maxDB.db ?? undefined;
  }
  log.warn(`WARN: ${liveAddBookBackUpFolderPath} does not exist.`);
  return undefined;
}

export async function initializeLiveDb() {
  log.info(`INFO: Initializing live db`);

  // Start from a completely clean slate when initializing to avoid database malformed errors
  await clearLiveDirectory();

  await createLiveDirectory();

  await Promise.all(
    liveDirPairings.map(async (obj) =>
      recursiveCopy(obj.original, obj.app, {
        overwrite: true,
      })
    )
  );

  const possibleAddressBookDb = await liveFindPossibleAddressBookDB();
  const liveDb = initializeDB(liveChatPaths.app);

  await dropAllTables(liveDb);

  // Add the contact name column regardless
  // It will just be empty if we don't find an address book db table
  // As a result, we can use COALESCE(contact_name, id)
  await addContactNameColumn(liveDb);

  // If we found an address book table, let's create a contact_table and attach it to the main lorDB.
  if (possibleAddressBookDb) {
    try {
      // Create contact table takes the possibleAddressBookDB not the LOR DB
      await new ContactTable(
        possibleAddressBookDb,
        AddressBookTableNames.CONTACT_TABLE
      ).create();

      // @ts-ignore
      const q = `ATTACH '${possibleAddressBookDb.filename}' AS ${addressBookDBAliasName}`;
      await sqlite3Wrapper.runP(liveDb, q);
      await setContactNameColumn(liveDb);
      closeDB(possibleAddressBookDb); // after setContactNameColumn, we have no use for the address book db
    } catch (e) {
      log.error(e);
    }
  }

  await new CoreMainTable(liveDb, CoreTableNames.CORE_MAIN_TABLE).create();

  log.info('INFO: Created live db.');

  return liveDb;
}
