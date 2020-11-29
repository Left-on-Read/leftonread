import log from 'electron-log';
import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import {
  addressBookDBName,
  addressBookBackUpFolderPath,
  addressBookPaths,
} from '../../utils/initUtils/constants/directories';
import { returnDBIfPopulated } from '../../db';

export const COUNT_CONTACTS_QUERY =
  'SELECT COUNT(*) AS count FROM ZABCDPHONENUMBER';

async function readAddressBookBackups(): Promise<sqlite3.Database | undefined> {
  if (fs.existsSync(addressBookBackUpFolderPath)) {
    log.info(`${addressBookBackUpFolderPath} exists`);
    const filenames = fs.readdirSync(addressBookBackUpFolderPath);
    const dbResults = await Promise.all(
      filenames.map(async (file) => {
        const path = `${addressBookBackUpFolderPath}/${file}/${addressBookDBName}`;
        return returnDBIfPopulated(path, COUNT_CONTACTS_QUERY);
      })
    );
    // NOTE: grab the first one that is populated and exit, instead of getting the biggest
    const populatedDB = dbResults.find((p) => p);
    if (populatedDB) {
      return populatedDB;
    }
    log.warn(`${addressBookBackUpFolderPath} dbs are all empty.`);
    return undefined;
  }
  log.warn(`${addressBookBackUpFolderPath} does not exist.`);
  return undefined;
}
/*
 * Look at all possible addressbook.db files
 * Return the one that is populated.
 * If nothing is populated, return undefined.
 */
export async function findPossibleAddressBookDB(): Promise<
  sqlite3.Database | undefined
> {
  const initialDBPath = `${addressBookPaths.app}/${addressBookDBName}`;
  const initialAddressBookDB = await returnDBIfPopulated(
    initialDBPath,
    COUNT_CONTACTS_QUERY
  );
  if (initialAddressBookDB) {
    log.info('inital addressbookDB found');
    return initialAddressBookDB;
  }
  return readAddressBookBackups();
}
