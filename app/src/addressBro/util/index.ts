import log from 'electron-log';
import * as fs from 'fs';
import * as sqlite3 from 'sqlite3';

import { DBWithRecordCount, getDBWithRecordCounts } from '../../db';
import { Columns as ContactNameColumns } from '../../tables/ContactTable';
import { AddressBookTableNames } from '../../tables/definitions';
import {
  addressBookBackUpFolderPath,
  addressBookDBAliasName,
  addressBookDBName,
  addressBookPaths,
} from '../../utils/initUtils/constants/directories';
import { normalizePhoneNumberStatement } from '../../utils/initUtils/constants/normalization';
import * as sqlite3Wrapper from '../../utils/initUtils/sqliteWrapper';

export const COUNT_CONTACTS_QUERY =
  'SELECT COUNT(*) AS count FROM ZABCDPHONENUMBER';

/*
 * Look at all possible addressbook.db files.
 * Use the largest.
 * If nothing is populated, return undefined.
 */
export async function findPossibleAddressBookDB(): Promise<
  sqlite3.Database | undefined
> {
  let dbRecordCountResults: DBWithRecordCount[] = [];

  // If there was a top level address db exists, read that
  const initialDBPath = `${addressBookPaths.app}/${addressBookDBName}`;
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
  if (fs.existsSync(addressBookBackUpFolderPath)) {
    log.info(`${addressBookBackUpFolderPath} exists`);
    const filenames = fs.readdirSync(addressBookBackUpFolderPath);

    const promises = filenames.map(async (file) => {
      const path = `${addressBookBackUpFolderPath}/${file}/${addressBookDBName}`;
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
    return maxDB.db ?? undefined;
  }
  log.warn(`WARN: ${addressBookBackUpFolderPath} does not exist.`);
  return undefined;
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
