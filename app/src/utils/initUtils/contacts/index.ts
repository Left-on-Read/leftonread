import * as sqlite3 from 'sqlite3';
import * as sqlite3Wrapper from '../sqliteWrapper';
import { Columns } from './columns';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getContactOptions(
  db: sqlite3.Database
): Promise<ContactOptions.ContactData[]> {
  const q = `
  SELECT
    COALESCE(contact_name, h.id) as ${Columns.VALUE},
    COALESCE(contact_name, h.id) as ${Columns.LABEL},
    COUNT(*) as ${Columns.COUNT},
    h.id as ${Columns.ID}
  FROM message
  JOIN handle h
    ON
      h.ROWID = handle_id
  GROUP BY h.id
  ORDER BY ${Columns.COUNT} DESC`;
  return sqlite3Wrapper.allP(db, q);
}
