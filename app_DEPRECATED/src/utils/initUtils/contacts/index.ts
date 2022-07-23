import * as sqlite3 from 'sqlite3';

import { ChatTableNames } from '../../../tables';
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
      COUNT(*) as ${Columns.COUNT}
    FROM handle h
      -- NOTE: for some reason a direct join to messages
      -- causes a CORRUPT malformed error
      LEFT JOIN ${ChatTableNames.COUNT_TABLE}
        ON contact = COALESCE(contact_name, h.id)
    -- NOTE: don't bother showing robo-contacts,
    -- i.e., Amazon shipping updates
    -- This might be problematic on short emails
    WHERE LENGTH(h.id) >= ${PHONE_NUMBER_LENGTH}
    GROUP BY COALESCE(contact_name, h.id)
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
