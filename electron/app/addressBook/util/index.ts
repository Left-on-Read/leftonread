import log from 'electron-log';
import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import {
  addressBookDBName,
  addressBookBackUpFolderPath,
  addressBookPaths,
} from '../../utils/initUtils/constants/directories';
import { initializeDB } from '../../chatBro/db';
import closeDB from '../../utils/closeUtils';
import * as sqlite3Wrapper from '../../chatBro/util/sqliteWrapper';

export const COUNT_CONTACTS_QUERY =
  'SELECT COUNT(*) AS count FROM ZABCDPHONENUMBER';

async function checkIfRecordsExist(
  db: sqlite3.Database,
  checkQuery: string
): Promise<boolean> {
  const checkResult = await sqlite3Wrapper.allP(db, checkQuery);
  if (checkResult && Number(checkResult[0].count) > 0) {
    log.info(`${db}: ${checkResult[0].count} records found`);
    return true;
  }
  log.info(`${db}: No records found`);
  return false;
}

async function readAddressBookBackups(): Promise<sqlite3.Database | undefined> {
  log.info('readAddressBookBackups start');
  if (fs.existsSync(addressBookBackUpFolderPath)) {
    log.info(`${addressBookBackUpFolderPath} exists`);
    const filenames = fs.readdirSync(addressBookBackUpFolderPath);
    log.info(filenames);
    /* eslint-disable */
    for (let i =0; i < filenames.length; i++) {
      // this will look something like: AddressBook/Sources/626356B2-E3BC-4980/AddressBook-v22.abcddb
      const path = `${addressBookBackUpFolderPath}/${filenames[i]}/${addressBookDBName}`;
      log.info(`Attempting to initialize ${path}`);
      try {
        const addressBookDB = initializeDB(path);
        if (await checkIfRecordsExist(addressBookDB, COUNT_CONTACTS_QUERY)) {
          return addressBookDB;
        }
        closeDB(addressBookDB);
      } catch (e) {
        log.warn(`${path} init failed.`);
      }
    }
    /* eslint-enable */
    log.warn(`${addressBookBackUpFolderPath} dbs are all empty.`);
    return undefined;
  }
  log.warn(`${addressBookBackUpFolderPath} does not exist.`);
  return undefined;
}
/*
 * Look at all possible addressbook.db files
 * Return the one that is populated or undefined
 */
export async function findPossibleAddressBookDB(): Promise<
  sqlite3.Database | undefined
> {
  const initialDBPath = `${addressBookPaths.app}/${addressBookDBName}`;
  try {
    const addressBookDB = initializeDB(initialDBPath);
    if (await checkIfRecordsExist(addressBookDB, COUNT_CONTACTS_QUERY)) {
      log.info('Non-backup addressBookDB found and populated.');
      return addressBookDB;
    }
    closeDB(addressBookDB);
    const possibleDB = await readAddressBookBackups();
    return possibleDB;
  } catch (e) {
    log.warn(`${initialDBPath} error: ${e}`);
    const possibleDB = await readAddressBookBackups();
    return possibleDB;
  }
}
