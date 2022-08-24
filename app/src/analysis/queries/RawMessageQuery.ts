import * as sqlite3 from 'sqlite3';

import { allP } from '../../utils/sqliteWrapper';
import { CoreTableNames } from '../tables/types';

export type RawMessageQueryResult = {
  message_id: number;
  message: string;
  is_from_me: number;
  human_readable_date: string;
  contact_name: string;
  cache_roomnames: string;
  phone_number: string;
  chat_id: string;
};

const getCoreQuery = (sortByTime?: boolean) => {
  let sortQ = '';
  if (sortByTime) {
    sortQ = 'ORDER BY chat_id ASC, human_readable_date DESC';
  }

  return `
        SELECT DISTINCT
            message_id,
            text AS message,
            is_from_me,
            human_readable_date,
            COALESCE(contact_name, id) as contact_name,
            cache_roomnames,
            id AS phone_number,
            chat_id
        FROM ${CoreTableNames.CORE_MAIN_TABLE}
        WHERE message_id IS NOT NULL AND chat_id IS NOT NULL
        ${sortQ}
    `;
};

export async function getAllMessages(
  db: sqlite3.Database,
  sortByTime?: boolean
): Promise<RawMessageQueryResult[]> {
  const q = getCoreQuery(sortByTime);

  return allP(db, q);
}
