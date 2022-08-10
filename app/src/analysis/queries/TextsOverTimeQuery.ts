import * as sqlite3 from 'sqlite3';

import { allP } from '../../utils/sqliteWrapper';
import { CoreMainTableColumns } from '../tables/CoreTable';
import { CoreTableNames } from '../tables/types';
import {
  getAllFilters,
  SharedQueryFilters,
} from './filters/sharedQueryFilters';

enum TextOverTimeColumns {
  DAY = 'day',
  SENT = 'sent',
  COUNT = 'count',
}

export type TextOverTimeResults = {
  DAY: Date;
  SENT: string;
  COUNT: string;
}[];

export async function queryTextsOverTime(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<TextOverTimeResults> {
  const allFilters = getAllFilters(filters);

  const q = `
      -- texts per time of day
      SELECT
          DATE(${CoreMainTableColumns.DATE}) as ${TextOverTimeColumns.DAY}, 
          is_from_me as ${TextOverTimeColumns.SENT},
          COUNT(*) as ${TextOverTimeColumns.COUNT}
        FROM ${CoreTableNames.CORE_MAIN_TABLE}
        ${allFilters}
        GROUP BY ${TextOverTimeColumns.DAY}, is_from_me
        ORDER BY ${TextOverTimeColumns.DAY} DESC
      `;
  return allP(db, q);
}
