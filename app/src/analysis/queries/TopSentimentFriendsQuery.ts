import * as sqlite3 from 'sqlite3';

import { DEFAULT_FILTER_LIMIT } from '../../constants/index';
import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { SentimentTableNames } from '../tables/types';
import {
  getAllFilters,
  SharedQueryFilters,
} from './filters/sharedQueryFilters';

export type TopSentimentFriendsResult = {
  friend: string;
  sentPct: number;
  receivedPct: number;
};

const getCoreQuery = (allFilters: string) => {
  return `
    SELECT
        SUM(CASE WHEN score >= 0 THEN score ELSE 0 END) AS positiveScore,
        SUM(CASE WHEN score < 0 THEN score ELSE 0 END) AS negativeScore,
        AVG(comparative) AS avgComparative,
        phone_number,
        COALESCE(contact_name, phone_number) AS friend,
        is_from_me,
        COUNT(*) AS count
    FROM ${SentimentTableNames.SENTIMENT_TABLE}
    ${allFilters}
    GROUP BY is_from_me, phone_number
`;
};

function getSentOrReceived(
  alias: string,
  isFromMe: boolean,
  allFilters: string
) {
  return `
  SELECT
    (CAST(positiveScore as REAL) / (positiveScore - negativeScore) ) AS ${alias},
    friend,
    phone_number,
    is_from_me,
    count
  FROM (${getCoreQuery(allFilters)})
  WHERE is_from_me = ${isFromMe ? '1' : '0'} AND count > 25
  `;
}

export async function queryTopSentimentFriends(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<TopSentimentFriendsResult[]> {
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
      sent + received AS total,
      (RECEIVED_TABLE.count + SENT_TABLE.count) AS totalCount,
      RECEIVED_TABLE.friend AS friend,
      sent AS sentPct,
      received AS receivedPct,
      RECEIVED_TABLE.phone_number AS phone_number
    FROM
      RECEIVED_TABLE
    -- NOTE: could do a LEFT JOIN here if you want to see group chats only
    JOIN
      SENT_TABLE
    ON
      RECEIVED_TABLE.friend = SENT_TABLE.friend
  )
  SELECT
    total,
    friend,
    sentPct,
    receivedPct,
    phone_number
  FROM
    COMBINED_TABLE
  WHERE totalCount >= 50
  ORDER BY total DESC
  LIMIT ${limit}
  `;

  return sqlite3Wrapper.allP(db, query);
}
