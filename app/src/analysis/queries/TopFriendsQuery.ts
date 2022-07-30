import * as sqlite3 from 'sqlite3';

import { filterOutReactions, GroupChatFilters } from '../../constants/filters';
import { DEFAULT_FILTER_LIMIT } from '../../constants/index';
import { objReplacementUnicode } from '../../constants/objReplacementUnicode';
import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { CoreTableNames } from '../tables/types';

export interface ITopFriendsFilters {
  limit?: number;
  contact?: string;
  word?: string;
  groupChat?: string;
}

interface ITopFriendsChartData {
  friend: string;
  total: number;
  sent: number;
  received: number;
}

export type TTopFriendsResults = ITopFriendsChartData[];

// NOTE(teddy): What table does this correspond to?
// NOTE(alex): It doesn't respond to a table, but rather the output of a query on the "core table".

enum TopFriendsColumns {
  COUNT = 'count',
  PHONE_NUMBER = 'phone_number',
  FRIEND = 'friend',
  IS_FROM_ME = 'sent',
  TEXT = 'text',
}

enum OutputColumns {
  FRIEND = 'friend',
  TOTAL = 'total',
  SENT = 'sent',
  RECEIVED = 'received',
}

function wordFilter(filters: ITopFriendsFilters): string | undefined {
  if (!filters.word || filters.word.length === 0) {
    return undefined;
  }
  // NOTE: using LIKE because TopFriends query is not split word by word
  return `LOWER(${
    TopFriendsColumns.TEXT
  }) LIKE "%${filters.word?.toLowerCase()}%"`;
}

function contactFilter(filters: ITopFriendsFilters): string | undefined {
  if (!filters.contact || filters.contact.length === 0) {
    return undefined;
  }
  return `${TopFriendsColumns.FRIEND} = "${filters.contact}"`;
}

function groupChatFilter(filters: ITopFriendsFilters): string | undefined {
  if (filters.groupChat === GroupChatFilters.ONLY_INDIVIDUAL) {
    return `cache_roomnames IS NULL`;
  }
  return undefined; // would query for both individual and groupchats
}

function fluffFilter(): string {
  return `
  ${filterOutReactions(TopFriendsColumns.TEXT)} AND unicode(TRIM(${
    TopFriendsColumns.TEXT
  })) != ${objReplacementUnicode}
  AND ${TopFriendsColumns.TEXT} IS NOT NULL
  AND LENGTH(${TopFriendsColumns.TEXT}) >= 1`;
}

function getAllFilters(filters: ITopFriendsFilters): string {
  const contact = contactFilter(filters);
  const groupChats = groupChatFilter(filters);
  const word = wordFilter(filters);
  const fluff = fluffFilter();

  const filtersArray = [contact, groupChats, word, fluff].filter(
    (filter) => !!filter
  );
  return filtersArray.length > 0 ? `WHERE ${filtersArray.join(' AND ')}` : '';
}

const getCoreQuery = (allFilters: string) => {
  return `SELECT
COUNT(*) as ${TopFriendsColumns.COUNT},
id as ${TopFriendsColumns.PHONE_NUMBER},
COALESCE(contact_name, id) as ${TopFriendsColumns.FRIEND},
id as ${TopFriendsColumns.FRIEND},
is_from_me as ${TopFriendsColumns.IS_FROM_ME}
FROM ${CoreTableNames.CORE_MAIN_TABLE}
-- NOTE: filters should always be applied as earliest as possible
${allFilters}
GROUP BY id, is_from_me
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
  filters: ITopFriendsFilters
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
      sent + received as ${OutputColumns.TOTAL},
      RECEIVED_TABLE.${TopFriendsColumns.FRIEND} as ${OutputColumns.FRIEND},
      sent as ${OutputColumns.SENT},
      received as ${OutputColumns.RECEIVED}
    FROM
      RECEIVED_TABLE
    -- NOTE: could do a LEFT JOIN here if you want to see group chats only
    JOIN
      SENT_TABLE
    ON
      RECEIVED_TABLE.${TopFriendsColumns.FRIEND} = SENT_TABLE.${
    TopFriendsColumns.FRIEND
  }
  )
  SELECT
    ${Object.keys(OutputColumns).join(', ')}
  FROM
    COMBINED_TABLE
  ORDER BY ${OutputColumns.TOTAL} DESC
  LIMIT ${limit}
  `;

  return sqlite3Wrapper.allP(db, query);
}
