import * as sqlite3 from 'sqlite3';

import { CoreTableNames } from '../../../tables/definitions';
import * as sqlite3Wrapper from '../../../utils/initUtils/sqliteWrapper';
import { DEFAULT_LIMIT } from '../../constants/filters';
import { Columns, OutputColumns } from './columns';
import getAllFilters from './filters';
import { ITopFriendsFilters, TTopFriendsResults } from './types';

const getCoreQuery = (allFilters: string) => {
  return `SELECT
    COUNT(*) as ${Columns.COUNT},
    id as ${Columns.PHONE_NUMBER},
    COALESCE(contact_name, id) as ${Columns.FRIEND},
    is_from_me as ${Columns.IS_FROM_ME}
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
    ${Columns.COUNT} AS ${alias},
    ${Columns.FRIEND}
  FROM (${getCoreQuery(allFilters)})
  WHERE ${Columns.IS_FROM_ME} = ${isFromMe ? '1' : '0'}
  GROUP BY ${Columns.FRIEND}`;
}

export async function queryTopFriends(
  db: sqlite3.Database,
  filters: ITopFriendsFilters
): Promise<TTopFriendsResults> {
  const limit = filters.limit || DEFAULT_LIMIT;
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
      RECEIVED_TABLE.${Columns.FRIEND} as ${OutputColumns.FRIEND},
      sent as ${OutputColumns.SENT},
      received as ${OutputColumns.RECEIVED}
    FROM
      RECEIVED_TABLE
    -- NOTE: could do a LEFT JOIN here if you want to see group chats only
    JOIN
      SENT_TABLE
    ON
      RECEIVED_TABLE.${Columns.FRIEND} = SENT_TABLE.${Columns.FRIEND}
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
