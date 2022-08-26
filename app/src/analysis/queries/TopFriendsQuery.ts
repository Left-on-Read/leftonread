import * as sqlite3 from 'sqlite3';

import { DEFAULT_FILTER_LIMIT } from '../../constants/index';
import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { CoreTableNames } from '../tables/types';
import {
  getAllFilters,
  SharedQueryFilters,
} from './filters/sharedQueryFilters';

interface ITopFriendsChartData {
  count: number;
  friend: string;
  is_from_me: string; // in reality these can be coerced into bools
  group_chat: string; // in reality these can be coerced into bools
}

export type TTopFriendsResults = ITopFriendsChartData[];

// enum TopFriendsColumns {
//   COUNT = 'count',
//   PHONE_NUMBER = 'phone_number',
//   FRIEND = 'friend',
//   IS_FROM_ME = 'sent',
//   TEXT = 'text',
// }

// enum TopFriendsOutputColumns {
//   FRIEND = 'friend',
//   TOTAL = 'total',
//   SENT = 'sent',
//   RECEIVED = 'received',
//   group_chat = 'group_chat',
// }

const getCoreQuery = (allFilters: string) => {
  return `
SELECT
COUNT(*) as count,
id as phone_number,
COALESCE(contact_name, id, contact_name_with_group_chat_participants_populated) as friend,
CASE WHEN (is_from_me IS 1) THEN "true" ELSE "false" END AS is_from_me,
CASE WHEN (room_name IS NULL) THEN "false" ELSE "true" END AS group_chat
FROM ${CoreTableNames.CORE_MAIN_TABLE}
-- NOTE: filters should always be applied as earliest as possible
${allFilters}
GROUP BY COALESCE(contact_name, id, contact_name_with_group_chat_participants_populated), is_from_me
`;
};

// function getSentOrReceived(
//   alias: string,
//   isFromMe: boolean,
//   allFilters: string
// ) {
//   return `
//   SELECT
//     count AS ${alias},
//     friend,
//     group_chat
//   FROM (${getCoreQuery(allFilters)})
//   WHERE sent = ${isFromMe ? '1' : '0'}`;
// }

export async function queryTopFriends(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<TTopFriendsResults> {
  const limit = filters.limit || DEFAULT_FILTER_LIMIT;
  const allFilters = getAllFilters(filters);
  // const query = `
  // WITH SENT_TABLE AS (
  //   ${getSentOrReceived('sent', true, allFilters)}
  // ),
  // RECEIVED_TABLE AS (
  //   ${getSentOrReceived('received', false, allFilters)}
  // ),
  // COMBINED_TABLE AS (
  //   SELECT
  //     sent + received as ${TopFriendsOutputColumns.TOTAL},
  //     -- NOTE: sent table has the group chat messages
  //     SENT_TABLE.friend as ${TopFriendsOutputColumns.FRIEND},
  //     sent as ${TopFriendsOutputColumns.SENT},
  //     received as ${TopFriendsOutputColumns.RECEIVED},
  //     SENT_TABLE.group_chat as group_chat
  //   FROM
  //     -- TODO: I think because we are RIGHT JOIN if you only
  //     -- receieve and don't send then that's a problem
  //     RECEIVED_TABLE
  //   RIGHT JOIN
  //     SENT_TABLE
  //   ON
  //     RECEIVED_TABLE.${TopFriendsColumns.FRIEND} = SENT_TABLE.${
  //   TopFriendsColumns.FRIEND
  // }
  // )
  // SELECT
  //   ${Object.keys(TopFriendsOutputColumns).join(', ')}
  // FROM
  //   COMBINED_TABLE
  // ORDER BY ${TopFriendsOutputColumns.TOTAL} DESC
  // LIMIT ${limit}
  // `;
  const query = getCoreQuery(allFilters);

  return sqlite3Wrapper.allP(db, query);
}
