import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { EngagementTableColumns } from '../tables/EngagementTable';
import { CoreTableNames, EngagementTableNames } from '../tables/types';
import {
  getAllFilters,
  SharedQueryFilters,
} from './filters/sharedQueryFilters';

export type EngagementResult = {
  value: number;
  isFromMe: number;
};

function getWhereStatement(filters: SharedQueryFilters) {
  const allFilters = getAllFilters(filters, undefined, 'contact_name');

  if (allFilters === '') {
    return 'WHERE ';
  }
  return `${allFilters} AND`;
}
export async function queryAverageMessageLength(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<EngagementResult[]> {
  const allFilters = getAllFilters(filters, undefined, 'contact_name');

  const q = `
    SELECT 
        AVG(text_length) AS value,
        is_from_me AS isFromMe
    FROM (
        SELECT 
            length(text) as text_length,
            is_from_me
        FROM ${CoreTableNames.CORE_MAIN_TABLE}
        ${allFilters}
    )
    GROUP BY is_from_me
  `;

  return sqlite3Wrapper.allP(db, q);
}

export async function queryDoubleTexts(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<EngagementResult[]> {
  const TEN_MINUTES_IN_SECONDS = 10 * 60;

  const q = `
      SELECT 
        COUNT(${EngagementTableColumns.IS_DOUBLE_TEXT}) AS value,
        is_from_me AS isFromMe
      FROM ${EngagementTableNames.ENGAGEMENT_TABLE}
      ${getWhereStatement(filters)} 
      ${EngagementTableColumns.DELAY_IN_SECONDS} > ${TEN_MINUTES_IN_SECONDS}
      GROUP BY is_from_me
    `;

  return sqlite3Wrapper.allP(db, q);
}

export async function queryLeftOnRead(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<EngagementResult[]> {
  const THREE_DAYS_IN_SECONDS = 60 * 60 * 24 * 3;
  const q = `
        SELECT 
          COUNT(*) AS value,
          is_from_me AS isFromMe
        FROM ${EngagementTableNames.ENGAGEMENT_TABLE}
        ${getWhereStatement(filters)} 
        ${EngagementTableColumns.DELAY_IN_SECONDS} > ${THREE_DAYS_IN_SECONDS}
        GROUP BY is_from_me
      `;
  const results: EngagementResult[] = await sqlite3Wrapper.allP(db, q);

  // Swap 1 and 0 for this metric
  return results.map((result) => ({
    ...result,
    isFromMe: result.isFromMe === 1 ? 0 : 1,
  }));
}

export async function queryAverageDelayV2(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<EngagementResult[]> {
  const allFilters = getAllFilters(filters, undefined, 'contact_name');

  const q = `
    SELECT
      AVG(${EngagementTableColumns.DELAY_IN_SECONDS}) as value,
      ${EngagementTableColumns.IS_FROM_ME} as isFromMe
    FROM ${EngagementTableNames.ENGAGEMENT_TABLE}
    ${getWhereStatement(filters)} 
    ${EngagementTableColumns.IS_DOUBLE_TEXT} = 0 AND ${
    EngagementTableColumns.DELAY_IN_SECONDS
  } < 5 * 24 * 60
    GROUP BY ${EngagementTableColumns.IS_FROM_ME}
    `;
  return sqlite3Wrapper.allP(db, q);
}
