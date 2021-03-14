import * as sqlite3 from 'sqlite3';
import * as sqlite3Wrapper from '../sqliteWrapper';
import { Columns } from './columns';
import { PHONE_NUMBER_LENGTH } from '../constants/normalization';

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
  -- NOTE: don't bother showing robo-contacts,
  -- i.e., Amazon shipping updates
  WHERE LENGTH(h.id) >= ${PHONE_NUMBER_LENGTH}
  GROUP BY h.id
  ORDER BY ${Columns.COUNT} DESC`;
  return sqlite3Wrapper.allP(db, q);
}
