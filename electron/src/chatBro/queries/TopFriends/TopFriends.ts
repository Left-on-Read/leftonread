import * as sqlite3 from 'sqlite3';
import { DEFAULT_LIMIT } from '../../constants/defaultFilters';
import getAllFilters from './filters';
import { Columns, OutputColumns } from './columns';

import * as sqlite3Wrapper from '../../../utils/initUtils/sqliteWrapper';

const getCoreQuery = (allFilters: string) => {
  return `SELECT
    COUNT(*) as ${Columns.COUNT},
    h.id as ${Columns.PHONE_NUMBER},
    COALESCE(h.contact_name, h.id) as ${Columns.FRIEND},
    is_from_me as ${Columns.IS_FROM_ME}
  FROM message
    JOIN handle h
    ON
      h.ROWID = handle_id
    -- NOTE: filters should always be applied as earliest as possible
    ${allFilters}
  GROUP BY h.id, is_from_me
`;
};

function getSentOrRecieved(
  alias: string,
  isFromMeToggle: string,
  allFilters: string
) {
  return `
  SELECT
    ${Columns.COUNT} AS ${alias},
    ${Columns.FRIEND}
  FROM (${getCoreQuery(allFilters)})
  WHERE ${Columns.IS_FROM_ME} = ${isFromMeToggle}
  GROUP BY ${Columns.FRIEND}`;
}

export async function queryTopFriends(
  db: sqlite3.Database,
  filters: TopFriendsTypes.Filters
): Promise<TopFriendsTypes.Results> {
  const limit = filters.limit || DEFAULT_LIMIT;
  const allFilters = getAllFilters(filters);
  const query = `
  WITH SENT_TABLE AS (
    ${getSentOrRecieved('sent', '1', allFilters)}
  ),
  RECEIVED_TABLE AS (
    ${getSentOrRecieved('received', '0', allFilters)}
  ),
  COMBINED_TABLE AS (
    SELECT
      sent + received as ${OutputColumns.TOTAL},
      RECEIVED_TABLE.${Columns.FRIEND} as ${OutputColumns.FRIEND},
      sent as ${OutputColumns.SENT},
      received as ${OutputColumns.RECEIVED}
    FROM
      RECEIVED_TABLE
    JOIN
      SENT_TABLE
    ON
      RECEIVED_TABLE.${Columns.FRIEND} = SENT_TABLE.${Columns.FRIEND}
  )
  SELECT
    ${Object.keys(OutputColumns).join(', ')}
  FROM
    COMBINED_TABLE
  ORDER BY total DESC
  LIMIT ${limit}
  `;

  return sqlite3Wrapper.allP(db, query);
}
