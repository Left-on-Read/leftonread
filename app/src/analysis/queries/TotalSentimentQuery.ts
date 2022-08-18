import * as sqlite3 from 'sqlite3';

import { allP } from '../../utils/sqliteWrapper';
import { SentimentTableNames } from '../tables/types';
import {
  getAllFilters,
  SharedQueryFilters,
} from './filters/sharedQueryFilters';

export type TotalSentimentResult = {
  positiveScore: number;
  negativeScore: number;
  avgComparative: number;
  is_from_me: number;
};

const getCoreQuery = (allFilters: string) => {
  return `
        SELECT is_from_me,
            SUM(CASE WHEN score >= 0 THEN score ELSE 0 END) as positiveScore,
            SUM(CASE WHEN score < 0 THEN score ELSE 0 END) as negativeScore,
            AVG(comparative) as avgComparative
        FROM ${SentimentTableNames.SENTIMENT_TABLE}
        ${allFilters}
        GROUP BY is_from_me
    `;
};

export async function queryTotalSentiment(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<TotalSentimentResult[]> {
  const allFilters = getAllFilters(filters, undefined, 'contact_name');
  const q = getCoreQuery(allFilters);

  return allP(db, q);
}
