import log from 'electron-log';
import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { CoreTableNames } from '../tables/types';
import {
  getAllFilters,
  SharedQueryFilters,
} from './filters/sharedQueryFilters';

interface TotalSentVsReceivedChartData {
  total: number;
  is_from_me: number;
}

export type TotalSentVsReceivedResults = TotalSentVsReceivedChartData[];

enum TotalSentVsReceivedOutputColumns {
  TOTAL = 'total',
  IS_FROM_ME = 'is_from_me',
}

enum TotalSentVsReceivedColumns {
  COUNT = 'count',
  FRIEND = 'friend',
  IS_FROM_ME = 'is_from_me',
  TEXT = 'text',
}

export async function queryTotalSentVsReceived(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<TotalSentVsReceivedResults> {
  const allFilters = getAllFilters(filters, undefined, 'contact_name');
  const q = `
  SELECT COUNT(*) as ${TotalSentVsReceivedOutputColumns.TOTAL}, 
  is_from_me AS ${TotalSentVsReceivedOutputColumns.IS_FROM_ME}
  FROM ${CoreTableNames.CORE_MAIN_TABLE} 
  ${allFilters}
  GROUP BY ${TotalSentVsReceivedColumns.IS_FROM_ME}
  `;
  return sqlite3Wrapper.allP(db, q);
}
