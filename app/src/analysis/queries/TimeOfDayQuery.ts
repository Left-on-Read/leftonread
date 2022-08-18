import * as sqlite3 from 'sqlite3';

import { allP } from '../../utils/sqliteWrapper';
import { CoreMainTableColumns } from '../tables/CoreTable';
import { CoreTableNames } from '../tables/types';
import {
  getAllFilters,
  SharedQueryFilters,
} from './filters/sharedQueryFilters';

export type TimeOfDayResults = {
  hour: number;
  is_from_me: number;
  count: number;
}[];

const getCoreQuery = (allFilters: string) => {
  return `
        SELECT
            strftime('%H', ${CoreMainTableColumns.DATE}) as hour,
            is_from_me,
            COUNT(*) as count
        FROM ${CoreTableNames.CORE_MAIN_TABLE}
        ${allFilters}
        GROUP BY strftime('%H', ${CoreMainTableColumns.DATE}), is_from_me
    `;
};

export async function queryTimeOfDaySent(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<TimeOfDayResults> {
  const allFilters = getAllFilters(filters, 'is_from_me = 1', 'contact_name');
  const q = getCoreQuery(allFilters);

  return allP(db, q);
}

export async function queryTimeOfDayReceived(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<TimeOfDayResults> {
  const allFilters = getAllFilters(filters, 'is_from_me = 0', 'contact_name');
  const q = getCoreQuery(allFilters);

  return allP(db, q);
}
