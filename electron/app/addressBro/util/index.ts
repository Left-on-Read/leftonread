import log from 'electron-log';
import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import {
  addressBookDBName,
  addressBookBackUpFolderPath,
  addressBookPaths,
} from '../../utils/initUtils/constants/directories';
import { returnDBIfPopulated } from '../../db';
import * as sqlite3Wrapper from '../../utils/initUtils/sqliteWrapper';
import { normalizePhoneNumberStatement } from '../../utils/initUtils/constants/normalization'

export const SET_CONTACT_NAME_COLUMN_QUERY =
  `UPDATE handle SET contact_name = (
    SELECT addressBookDB.contact_table.contact_name
      FROM addressBookDB.contact_table
        WHERE ${normalizePhoneNumberStatement(`handle.id`)}
    = addressBookDB.contact_table.contact_phone
    )`;

export const ADD_CONTACT_NAME_COLUMN_QUERY =
  'ALTER TABLE handle ADD contact_name VARCHAR(255)';

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

export async function addContactNameColumn(db:sqlite3.Database) {
  await sqlite3Wrapper.runP(db, ADD_CONTACT_NAME_COLUMN_QUERY);
}

export async function setContactNameColumn(db:sqlite3.Database) {
  await sqlite3Wrapper.runP(db, SET_CONTACT_NAME_COLUMN_QUERY);
}
