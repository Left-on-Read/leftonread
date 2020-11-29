import * as _ from 'lodash';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import { ContactTable } from './ContactTable';
import { TableNames } from './definitions';

export async function createContactTable(
  db: sqlite3.Database
): Promise<TableNames[]> {
  const tables = [new ContactTable(db, TableNames.CONTACT_TABLE)];

  const createTablePromises = tables.map((table) => table.create());
  log.info('Contact table successfully created');
  return Promise.all(createTablePromises);
}

export { ContactTable, TableNames };
