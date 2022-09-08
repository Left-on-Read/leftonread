import * as sqlite3 from 'sqlite3';

import { PHONE_NUMBER_LENGTH } from '../../utils/normalization';
import { allP } from '../../utils/sqliteWrapper';
import { ChatTableNames } from '../tables/types';

enum Columns {
  COUNT = 'mycount',
  VALUE = 'value',
  LABEL = 'label',
  ID = 'id',
}

export interface ContactOptionsQueryResult {
  value: string;
  label: string;
  mycount: number;
  phoneNumber: string;
}

export async function queryContactOptions(
  db: sqlite3.Database
): Promise<ContactOptionsQueryResult[]> {
  const q = `
      SELECT
          COALESCE(contact_name, h.id) as ${Columns.VALUE},
          COALESCE(contact_name, h.id) as ${Columns.LABEL},
          h.id as phoneNumber,
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
  return allP(db, q);
}
