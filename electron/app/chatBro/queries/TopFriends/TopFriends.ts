import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../../utils/initUtils/sqliteWrapper';
import { ChatTableNames } from '../../../tables';
import { Columns } from '../../../tables/TopFriendsTable';

export async function queryTopFriends(
  db: sqlite3.Database,
  tableName: ChatTableNames.TOP_FRIENDS_TABLE,
  opts: TopFriendsTypes.Options = {}
): Promise<TopFriendsTypes.Results> {
  const limit = opts.limit || 5;
  const query = `
    SELECT
      ${Columns.COUNT},
      ${Columns.FRIEND},
      ${Columns.PHONE_NUMBER}
    FROM ${tableName}
    ORDER BY ${Columns.COUNT} DESC
    LIMIT ${limit}
  `;

  return sqlite3Wrapper.allP(db, query);
}
