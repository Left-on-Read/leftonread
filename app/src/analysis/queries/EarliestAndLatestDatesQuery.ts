import * as sqlite3 from 'sqlite3';

import { allP } from '../../utils/sqliteWrapper';
import { CoreMainTableColumns } from '../tables/CoreTable';
import { CoreTableNames } from '../tables/types';

enum EarliestAndLatestDateColumns {
  EARLIEST_DATE = 'earliest_date',
  LATEST_DATE = 'latest_date',
}

export type EarliestAndLatestDateResults = {
  earliest_date: string;
  latest_date: string;
}[];

export async function queryEarliestAndLatestDates(
  db: sqlite3.Database
): Promise<EarliestAndLatestDateResults> {
  const q = `
      SELECT
          MIN(${CoreMainTableColumns.DATE}) as ${EarliestAndLatestDateColumns.EARLIEST_DATE},
          MAX(${CoreMainTableColumns.DATE}) as ${EarliestAndLatestDateColumns.LATEST_DATE}
        FROM ${CoreTableNames.CORE_MAIN_TABLE}
      `;
  return allP(db, q);
}
