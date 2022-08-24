import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { EngagementTableColumns } from '../tables/EngagementTable';
import { EngagementTableNames } from '../tables/types';
import {
  getAllFilters,
  SharedQueryFilters,
} from './filters/sharedQueryFilters';

export type AverageDelayResult = {
  averageDelayInSeconds: number;
  isFromMe: number;
};

export async function queryAverageDelay(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<AverageDelayResult[]> {
  const allFilters = getAllFilters(filters, undefined, 'contact_name');

  const q = `
  SELECT
    AVG(${EngagementTableColumns.DELAY_IN_SECONDS}) as averageDelayInSeconds,
    ${EngagementTableColumns.IS_FROM_ME} as isFromMe
  FROM ${EngagementTableNames.ENGAGEMENT_TABLE}
  ${allFilters} AND ${EngagementTableColumns.IS_DOUBLE_TEXT} = 0 AND ${EngagementTableColumns.DELAY_IN_SECONDS} < 5 * 24 * 60
  GROUP BY ${EngagementTableColumns.IS_FROM_ME}
  `;
  return sqlite3Wrapper.allP(db, q);
}
