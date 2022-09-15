import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../../utils/sqliteWrapper';
import {
  getAllGroupChatTabFilters,
  SharedGroupChatTabQueryFilters,
} from '../filters/sharedGroupChatTabFilters';

export type GroupActivityOverTimeResult = {
  count: number;
  date: string;
  group_chat_name: string;
};

export async function queryGroupChatActivityOverTime(
  db: sqlite3.Database,
  filters: SharedGroupChatTabQueryFilters
): Promise<GroupActivityOverTimeResult[]> {
  const allFilters = getAllGroupChatTabFilters(filters);
  const q = `
    WITH LOR_TEXTS_OVER_TIME AS (
        SELECT
            DATE(human_readable_date) as date,
            COUNT(*) as count,
            group_chat_name
        FROM group_chat_core_table
        ${allFilters}
        GROUP BY DATE(human_readable_date)
    )

    SELECT
    ct.date as date,
    COALESCE(count, 0) as count,
    group_chat_name
    FROM calendar_table ct
    LEFT JOIN LOR_TEXTS_OVER_TIME lt
    ON lt.date = ct.date
    WHERE ct.date BETWEEN (SELECT MIN(date) FROM LOR_TEXTS_OVER_TIME) AND (SELECT MAX(date) FROM LOR_TEXTS_OVER_TIME)
`;

  return sqlite3Wrapper.allP(db, q);
}
