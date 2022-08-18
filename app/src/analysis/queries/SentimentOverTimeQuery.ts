import * as sqlite3 from 'sqlite3';

import { allP } from '../../utils/sqliteWrapper';
import { CalendarTableNames, SentimentTableNames } from '../tables/types';
import {
  getAllFilters,
  SharedQueryFilters,
} from './filters/sharedQueryFilters';

export type SentimentOverTimeResult = {
  positiveScore: number;
  negativeScore: number;
  avgComparative: number;
  is_from_me: number;
  day: string;
};

const getCoreQuery = (allFilters: string) => {
  return `
    WITH LOR_SENTIMENT_OVER_TIME AS (
        SELECT is_from_me,
            SUM(CASE WHEN score >= 0 THEN score ELSE 0 END) as positiveScore,
            SUM(CASE WHEN score < 0 THEN score ELSE 0 END) as negativeScore,
            AVG(comparative) as avgComparative,
            DATE(human_readable_date) as day,
            human_readable_date
        FROM ${SentimentTableNames.SENTIMENT_TABLE}
        ${allFilters}
        GROUP BY DATE(human_readable_date), is_from_me
    )

    SELECT 
        calendar_table.date as day, 
        COALESCE(positiveScore, 0) AS positiveScore,
        COALESCE(negativeScore, 0) AS negativeScore,
        COALESCE(avgComparative, 0) AS avgComparative,
        is_from_me
    FROM ${CalendarTableNames.CALENDAR_TABLE}
    LEFT JOIN LOR_SENTIMENT_OVER_TIME
    ON day = ${CalendarTableNames.CALENDAR_TABLE}.date
    WHERE ${CalendarTableNames.CALENDAR_TABLE}.date BETWEEN (SELECT MIN(day) FROM LOR_SENTIMENT_OVER_TIME) AND (SELECT MAX(day) FROM LOR_SENTIMENT_OVER_TIME) 
    `;
};

export async function querySentimentOverTimeSent(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<SentimentOverTimeResult[]> {
  const allFilters = getAllFilters(filters, 'is_from_me=1', 'contact_name');
  const q = getCoreQuery(allFilters);

  return allP(db, q);
}

export async function querySentimentOverTimeReceived(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<SentimentOverTimeResult[]> {
  const allFilters = getAllFilters(filters, 'is_from_me=0', 'contact_name');
  const q = getCoreQuery(allFilters);

  return allP(db, q);
}
