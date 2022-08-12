import * as sqlite3 from 'sqlite3';

import { allP } from '../../utils/sqliteWrapper';
import { CoreMainTableColumns } from '../tables/CoreTable';
import { CalendarTableNames, CoreTableNames } from '../tables/types';
import {
  getAllFilters,
  SharedQueryFilters,
} from './filters/sharedQueryFilters';

enum TextOverTimeColumns {
  DAY = 'day',
  SENT = 'is_from_me',
  COUNT = 'count',
}

export type TextOverTimeResults = {
  day: Date;
  is_from_me: number;
  count: number;
}[];

const getCoreQuery = (allFilters: string) => {
  return `
    WITH LOR_TEXTS_OVER_TIME AS (
        SELECT
            DATE(${CoreMainTableColumns.DATE}) as ${CoreMainTableColumns.DATE},
            is_from_me, 
            COUNT(*) as count
        FROM ${CoreTableNames.CORE_MAIN_TABLE}
        ${allFilters}
        GROUP BY DATE(${CoreMainTableColumns.DATE}), is_from_me
    )
    
    SELECT calendar_table.date as ${TextOverTimeColumns.DAY}, ${TextOverTimeColumns.SENT}, COALESCE(count, 0) as ${TextOverTimeColumns.COUNT} FROM ${CalendarTableNames.CALENDAR_TABLE}
    LEFT JOIN LOR_TEXTS_OVER_TIME
    ON ${CoreMainTableColumns.DATE} = ${CalendarTableNames.CALENDAR_TABLE}.date
    WHERE ${CalendarTableNames.CALENDAR_TABLE}.date BETWEEN (SELECT MIN(${CoreMainTableColumns.DATE}) FROM LOR_TEXTS_OVER_TIME) AND (SELECT MAX(${CoreMainTableColumns.DATE}) FROM LOR_TEXTS_OVER_TIME)`;
};

export async function queryTextsOverTimeSent(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<TextOverTimeResults> {
  const allFilters = getAllFilters(filters, 'is_from_me = 1', 'contact_name');
  const q = getCoreQuery(allFilters);

  return allP(db, q);
}

export async function queryTextsOverTimeReceived(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<TextOverTimeResults> {
  const allFilters = getAllFilters(filters, 'is_from_me = 0', 'contact_name');
  const q = getCoreQuery(allFilters);

  return allP(db, q);
}
