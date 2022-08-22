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
};

const getCoreQuery = () => {
  return `
        SELECT
            message_id,
            text AS message,
            is_from_me,
            human_readable_date,
            COALESCE(contact_name, id) as contact_name,
            cache_roomnames,
            id AS phone_number
        FROM ${CoreTableNames.CORE_MAIN_TABLE}
    `;
};

export async function getAllMessages(
  db: sqlite3.Database
): Promise<RawMessageQueryResult[]> {
  const q = getCoreQuery();

  return allP(db, q);
}
