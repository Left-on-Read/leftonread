import * as sqlite3 from 'sqlite3';

import { PHONE_NUMBER_LENGTH } from '../constants/normalization';
import * as sqlite3Wrapper from '../sqliteWrapper';
import { Columns } from './columns';
import { IContactData } from './types';

export async function getContactOptions(
  db: sqlite3.Database
): Promise<IContactData[]> {
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
    ORDER BY
    CASE
      -- NOTE: must use the COALESCE value here,
      -- because all ids are phone numbers/emails
      WHEN ${Columns.VALUE} LIKE '%@%' THEN -1
      WHEN ${Columns.VALUE} GLOB '*[0-9]*' THEN -2
      ELSE ${Columns.COUNT}
    END DESC
  `;
  return sqlite3Wrapper.allP(db, q);
}
