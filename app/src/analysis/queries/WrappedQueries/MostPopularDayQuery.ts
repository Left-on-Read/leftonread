import log from 'electron-log';
import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../../utils/sqliteWrapper';
import {
  getAllFilters,
  SharedQueryFilters,
} from '../filters/sharedQueryFilters';

export type MostPopularDayResult = {
  mostPopularDate: Date;
  mostPopularCount: number;
  avgCount: number;
};

export async function queryMostPopularDay(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<MostPopularDayResult> {
  const allFilters = getAllFilters(filters, undefined, 'contact_name');

  const q = `SELECT COUNT(*) as mostPopularCount, DATE(human_readable_date) as mostPopularDate
  FROM core_main_table ${allFilters} GROUP BY date(human_readable_date) ORDER BY mostPopularCount DESC LIMIT 1`;
  const popularPromise: Promise<
    {
      mostPopularCount: string;
      mostPopularDate: string;
    }[]
  > = sqlite3Wrapper.allP(db, q);

  const qTwo = `WITH TB AS (SELECT COUNT(*) as count, DATE(human_readable_date) FROM core_main_table  GROUP BY date(human_readable_date) ORDER BY count DESC)

  SELECT CAST(AVG(count) as INTEGER) as avgCount FROM TB
  `;
  const avgPromise: Promise<{ avgCount: number }[]> = sqlite3Wrapper.allP(
    db,
    qTwo
  );

  const [popData, avgData] = await Promise.all([popularPromise, avgPromise]);

  if (popData.length > 0 && avgData.length > 0) {
    return {
      avgCount: Number(avgData[0].avgCount),
      mostPopularCount: Number(popData[0].mostPopularCount),
      mostPopularDate: new Date(popData[0].mostPopularDate),
    };
  }
  log.error('No data returned for most popular day');
  return {
    avgCount: 0,
    mostPopularCount: 0,
    mostPopularDate: new Date(),
  };
}
