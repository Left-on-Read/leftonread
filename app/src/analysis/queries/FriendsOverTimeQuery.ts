import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../utils/sqliteWrapper';

export type FriendsOverTimeResult = {
  date: Date;
  count: number;
  contactName: string;
};

export async function queryFriendsOverTimeQuery(
  db: sqlite3.Database,
  contactName: string
): Promise<FriendsOverTimeResult[]> {
  const q = `
    WITH TEXTS_OVER_TIME_TB AS (
        SELECT DATE(human_readable_date) as DATE,
        count(*) as pre_count,
        coalesced_contact_name as contact_name
        FROM core_main_table
        WHERE coalesced_contact_name = "${contactName}"
        AND cache_roomnames IS NULL
        GROUP BY DATE(human_readable_date)
    )
    SELECT  ct.date, COALESCE(pre_count, 0) as count, coalesce("${contactName}", contact_name) as contactName FROM calendar_table ct
    LEFT JOIN TEXTS_OVER_TIME_TB tb
    ON tb.DATE = ct.DATE
    WHERE ct.DATE BETWEEN 
    (SELECT MIN(DATE(human_readable_date)) FROM core_main_table)
    AND 
    (SELECT MAX(DATE(human_readable_date)) FROM core_main_table) 
`;

  return sqlite3Wrapper.allP(db, q);
}
