import * as sqlite3 from 'sqlite3';

import { DEFAULT_FILTER_LIMIT } from '../../constants/index';
import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { CoreTableNames } from '../tables/types';
import {
  getAllFilters,
  SharedQueryFilters,
} from './filters/sharedQueryFilters';

interface ITopFriendsChartData {
  friend: string;
  total: number;
  sent: number;
  received: number;
}

export type TTopFriendsResults = ITopFriendsChartData[];

enum TopFriendsColumns {
  COUNT = 'count',
  PHONE_NUMBER = 'phone_number',
  FRIEND = 'friend',
  IS_FROM_ME = 'sent',
  TEXT = 'text',
}

enum TopFriendsOutputColumns {
  FRIEND = 'friend',
  TOTAL = 'total',
  SENT = 'sent',
  RECEIVED = 'received',
}

const getCoreQuery = (allFilters: string) => {
  return `SELECT
COUNT(*) as ${TopFriendsColumns.COUNT},
id as ${TopFriendsColumns.PHONE_NUMBER},
COALESCE(contact_name, id) as ${TopFriendsColumns.FRIEND},
is_from_me as ${TopFriendsColumns.IS_FROM_ME}
FROM ${CoreTableNames.CORE_MAIN_TABLE}
-- NOTE: filters should always be applied as earliest as possible
${allFilters}
GROUP BY COALESCE(contact_name, id), is_from_me
`;
};

function getSentOrReceived(
  alias: string,
  isFromMe: boolean,
  allFilters: string
) {
  return `
  SELECT
    ${TopFriendsColumns.COUNT} AS ${alias},
    ${TopFriendsColumns.FRIEND}
  FROM (${getCoreQuery(allFilters)})
  WHERE ${TopFriendsColumns.IS_FROM_ME} = ${isFromMe ? '1' : '0'}
  GROUP BY ${TopFriendsColumns.FRIEND}`;
}

export async function queryTopFriends(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<TTopFriendsResults> {
  const limit = filters.limit || DEFAULT_FILTER_LIMIT;
  const allFilters = getAllFilters(filters);
  const query = `
  WITH SENT_TABLE AS (
    ${getSentOrReceived('sent', true, allFilters)}
  ),
  RECEIVED_TABLE AS (
    ${getSentOrReceived('received', false, allFilters)}
  ),
  COMBINED_TABLE AS (
    SELECT
      sent + received as ${TopFriendsOutputColumns.TOTAL},
      SENT_TABLE.${TopFriendsColumns.FRIEND} as ${
    TopFriendsOutputColumns.FRIEND
  },
      sent as ${TopFriendsOutputColumns.SENT},
      received as ${TopFriendsOutputColumns.RECEIVED}
    FROM
      RECEIVED_TABLE
    -- NOTE: could do a LEFT JOIN here if you want to see group chats only
    -- RIGHT JOIN gives you both
    RIGHT JOIN
      SENT_TABLE
    ON
      RECEIVED_TABLE.${TopFriendsColumns.FRIEND} = SENT_TABLE.${
    TopFriendsColumns.FRIEND
  }
  )
  SELECT
    ${Object.keys(TopFriendsOutputColumns).join(', ')}
  FROM
    COMBINED_TABLE
  ORDER BY ${TopFriendsOutputColumns.TOTAL} DESC
  LIMIT ${limit}
  `;

  return sqlite3Wrapper.allP(db, query);
}
