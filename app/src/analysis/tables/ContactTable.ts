import log from 'electron-log';
import * as fs from 'fs';
import * as sqlite3 from 'sqlite3';

import { DBWithRecordCount, getDBWithRecordCounts } from '../../utils/db';
import { normalizePhoneNumberStatement } from '../../utils/normalization';
import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import {
  addressBookBackUpFolderPath,
  addressBookDBAliasName,
  addressBookDBName,
  addressBookPaths,
} from '../directories';
import { AddressBookTableNames, Table } from './types';

export enum Columns {
  CONTACT_NAME = 'contact_name',
  CONTACT_PHONE = 'contact_phone',
}

export class ContactTable extends Table {
  async create(): Promise<AddressBookTableNames> {
    const q = `
    CREATE TABLE ${this.name} AS
    WITH CONTACTS_CLEAN_TABLE AS (
    SELECT
      ZABCDRECORD.Z_PK,
      ZABCDRECORD.ZFIRSTNAME,
      ZABCDRECORD.ZLASTNAME,
      -- TODO: I understand this is ugly... use regex.
      replace(
        replace(
          replace(
            replace(
              replace(
                ZABCDPHONENUMBER.ZFULLNUMBER,
              "(", ""),
            ")",""),
          "_", ""),
        "-", ""),
      " ", "")
    as ZFULLNUMBER
      FROM ZABCDRECORD
    LEFT JOIN ZABCDPHONENUMBER ON ZABCDPHONENUMBER.ZOWNER = ZABCDRECORD.Z_PK
      WHERE ZABCDPHONENUMBER.ZFULLNUMBER IS NOT NULL
    )
    SELECT
    -- NOTE: the COALESCE is important here because the || (concat operator)
    -- returns NULL if one of the columns is NULL
    TRIM(
      COALESCE(ZFIRSTNAME, " ") || " " || COALESCE(ZLASTNAME, " ")
    ) as ${Columns.CONTACT_NAME},
    ${normalizePhoneNumberStatement(`ZFULLNUMBER`)} AS ${Columns.CONTACT_PHONE}
    FROM CONTACTS_CLEAN_TABLE`;
    return sqlite3Wrapper.runP(this.db, q);
  }
}

// export async function createContactTable(
//   db: sqlite3.Database
// ): Promise<AddressBookTableNames[]> {
//   const tables = [new ContactTable(db, AddressBookTableNames.CONTACT_TABLE)];

//   const createTablePromises = tables.map((table) => table.create());
//   log.info(`INFO: ${AddressBookTableNames.CONTACT_TABLE} successfully created`);
//   return Promise.all(createTablePromises) as Promise<AddressBookTableNames[]>;
// }

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
  const ADD_CONTACT_NAME_COLUMN_QUERY = `ALTER TABLE handle ADD ${Columns.CONTACT_NAME} VARCHAR(255)`;
  await sqlite3Wrapper.runP(db, ADD_CONTACT_NAME_COLUMN_QUERY);
}

export async function setContactNameColumn(db: sqlite3.Database) {
  const SET_CONTACT_NAME_COLUMN_QUERY = `UPDATE handle SET ${
    Columns.CONTACT_NAME
  } = (
    SELECT ${addressBookDBAliasName}.${AddressBookTableNames.CONTACT_TABLE}.${
    Columns.CONTACT_NAME
  }
      FROM ${addressBookDBAliasName}.${AddressBookTableNames.CONTACT_TABLE}
        WHERE ${normalizePhoneNumberStatement(`handle.id`)}
    = ${addressBookDBAliasName}.${AddressBookTableNames.CONTACT_TABLE}.${
    Columns.CONTACT_PHONE
  }
    )`;
  await sqlite3Wrapper.runP(db, SET_CONTACT_NAME_COLUMN_QUERY);
}
