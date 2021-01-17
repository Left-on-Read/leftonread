import log from 'electron-log';
import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import {
  addressBookDBName,
  addressBookBackUpFolderPath,
  addressBookPaths,
  addressBookDBAliasName,
} from '../../utils/initUtils/constants/directories';
import { DBWithRecordCount, getDBWithRecordCounts } from '../../db';
import * as sqlite3Wrapper from '../../utils/initUtils/sqliteWrapper';
import { normalizePhoneNumberStatement } from '../../utils/initUtils/constants/normalization';
import { AddressBookTableNames } from '../../tables/definitions';
import { Columns as ContactNameColumns } from '../../tables/ContactTable';

export const COUNT_CONTACTS_QUERY =
  'SELECT COUNT(*) AS count FROM ZABCDPHONENUMBER';

async function readAddressBookBackups(): Promise<sqlite3.Database | undefined> {
  if (fs.existsSync(addressBookBackUpFolderPath)) {
    log.info(`${addressBookBackUpFolderPath} exists`);
    const filenames = fs.readdirSync(addressBookBackUpFolderPath);
    const dbRecordCountResults = await Promise.all(
      filenames.map(async (file) => {
        const path = `${addressBookBackUpFolderPath}/${file}/${addressBookDBName}`;
        return getDBWithRecordCounts(path, COUNT_CONTACTS_QUERY);
      })
    );
    if (dbRecordCountResults && dbRecordCountResults[0]) {
      // get db with biggest record counts
      const getMaxDBRC = (dbrcList: DBWithRecordCount[]) =>
        dbrcList.reduce((a, b) => (a.recordCount > b.recordCount ? a : b));
      const maxDB = getMaxDBRC(dbRecordCountResults as DBWithRecordCount[]);
      return maxDB.db;
    }
    log.warn(`${addressBookBackUpFolderPath} dbs are all empty.`);
    return undefined;
  }
  log.warn(`${addressBookBackUpFolderPath} does not exist.`);
  return undefined;
}
/*
 * Look at all possible addressbook.db files.
 * Return top-level db if populated.
 * Else find the largest in /Sources/.
 * If nothing is populated, return undefined.
 */
export async function findPossibleAddressBookDB(): Promise<
  sqlite3.Database | undefined
> {
  const initialDBPath = `${addressBookPaths.app}/${addressBookDBName}`;
  const initialAddressBookDBRecordCount = await getDBWithRecordCounts(
    initialDBPath,
    COUNT_CONTACTS_QUERY
  );
  if (
    initialAddressBookDBRecordCount &&
    initialAddressBookDBRecordCount.recordCount > 0
  ) {
    log.info('inital addressbookDB found');
    return initialAddressBookDBRecordCount.db;
  }
  return readAddressBookBackups();
}

export async function addContactNameColumn(db: sqlite3.Database) {
  const ADD_CONTACT_NAME_COLUMN_QUERY = `ALTER TABLE handle ADD ${ContactNameColumns.CONTACT_NAME} VARCHAR(255)`;
  await sqlite3Wrapper.runP(db, ADD_CONTACT_NAME_COLUMN_QUERY);
}

export async function setContactNameColumn(db: sqlite3.Database) {
  const SET_CONTACT_NAME_COLUMN_QUERY = `UPDATE handle SET ${
    ContactNameColumns.CONTACT_NAME
  } = (
    SELECT ${addressBookDBAliasName}.${AddressBookTableNames.CONTACT_TABLE}.${
    ContactNameColumns.CONTACT_NAME
  }
      FROM ${addressBookDBAliasName}.${AddressBookTableNames.CONTACT_TABLE}
        WHERE ${normalizePhoneNumberStatement(`handle.id`)}
    = ${addressBookDBAliasName}.${AddressBookTableNames.CONTACT_TABLE}.${
    ContactNameColumns.CONTACT_PHONE
  }
    )`;
  await sqlite3Wrapper.runP(db, SET_CONTACT_NAME_COLUMN_QUERY);
}
