import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../../utils/initUtils/sqliteWrapper';

const Columns = {
  COUNT: 'count',
  PHONE_NUMBER: 'phone_number',
  FRIEND: 'friend',
  IS_FROM_ME: 'sent',
};

const FROM_QUERY = `
  SELECT
    COUNT(*) as ${Columns.COUNT},
    h.id as ${Columns.PHONE_NUMBER},
    COALESCE(h.contact_name, h.id) as ${Columns.FRIEND},
    is_from_me as ${Columns.IS_FROM_ME}
  FROM message
    JOIN handle h
    ON h.ROWID = handle_id
    -- NOTE: Excludes group chats
    WHERE message.cache_roomnames IS NULL
  GROUP BY h.id, is_from_me
`;

function getSentOrRecieved(alias: string, isFromMeToggle: string) {
  return `
  SELECT
    ${Columns.COUNT} AS ${alias},
    ${Columns.FRIEND}
  FROM (${FROM_QUERY})
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
    ${getSentOrRecieved('sent', '1')}
  ),
  RECEIVED_TABLE AS (
    ${getSentOrRecieved('received', '0')}
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
