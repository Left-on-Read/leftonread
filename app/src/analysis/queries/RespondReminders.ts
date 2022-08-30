import * as sqlite3 from 'sqlite3';

import { filterOutReactions } from '../../constants/filters';
import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { CoreTableNames } from '../tables/types';

export type RespondRemindersResult = {
  message: string;
  friend: string;
  date: string;
};

export async function queryRespondReminders(
  db: sqlite3.Database
): Promise<RespondRemindersResult[]> {
  // Get all texts from the last 7 days that are not group chats
  // Group by contact, and save last message

  const q = `
    WITH candidates as 
      (SELECT 
        MAX(message_id) as message_id,
        MAX(contact_name) as contact_name,
        id
      FROM ${CoreTableNames.CORE_MAIN_TABLE}
      WHERE 
        human_readable_date > (SELECT DATETIME('now', '-7 day'))
        AND cache_roomnames IS NULL
        AND ${filterOutReactions()}
      GROUP BY id
    )

    SELECT
      m.text AS message,
      COALESCE(m.contact_name, m.id) AS friend,
      m.human_readable_date AS date
    FROM candidates
    LEFT JOIN ${CoreTableNames.CORE_MAIN_TABLE} m
      ON candidates.message_id = m.message_id
    WHERE m.is_from_me = 0
  `;

  return sqlite3Wrapper.allP(db, q);
}
