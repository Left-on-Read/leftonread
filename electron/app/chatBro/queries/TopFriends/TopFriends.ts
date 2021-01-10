import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../../utils/initUtils/sqliteWrapper';
import { ChatTableNames } from '../../../tables';
import { Columns } from '../../../tables/TopFriendsTable';

function mainQuery(alias: string, isFromMeToggle: string) {
  return `
  SELECT
    ${Columns.COUNT} AS ${alias},
    ${Columns.FRIEND}
  FROM ${ChatTableNames.TOP_FRIENDS_TABLE}
  WHERE ${Columns.IS_FROM_ME} = ${isFromMeToggle}
  GROUP BY ${Columns.FRIEND}`;
}

export async function queryTopFriends(
  db: sqlite3.Database,
  opts: TopFriendsTypes.Options = {}
): Promise<TopFriendsTypes.Results> {
  const limit = opts.limit || 15;
  const query = `
  WITH SENT_TABLE AS (
    ${mainQuery('sent', '1')}
  ),
  RECEIVED_TABLE AS (
    ${mainQuery('received', '0')}
  )
  SELECT
    sent + received as total,
    RECEIVED_TABLE.${Columns.FRIEND},
    sent,
    received
  FROM
    RECEIVED_TABLE
  JOIN
    SENT_TABLE
  ON
    RECEIVED_TABLE.${Columns.FRIEND} = SENT_TABLE.${Columns.FRIEND}
  ORDER BY total DESC
  LIMIT ${limit}
  `;

  return sqlite3Wrapper.allP(db, query);
}
