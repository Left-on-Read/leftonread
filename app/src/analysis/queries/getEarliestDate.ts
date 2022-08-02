import { CoreMainTable } from 'analysis/tables/CoreTable';
import * as sqlite3 from 'sqlite3';

import { IContactData } from '../../components/Filters/ContactFilter';
import { PHONE_NUMBER_LENGTH } from '../../utils/normalization';
import { allP } from '../../utils/sqliteWrapper';
import { ChatTableNames } from '../tables/types';

enum EarliestDateColumm {
  EARLIEST_DATE = 'earliest_date',
}

export async function getEarliestDate(
  db: sqlite3.Database
): Promise<IContactData[]> {
  const q = `
      SELECT
          message_date as ${EarliestDateColumm}
        FROM ${CoreMainTable}
        ORDER BY
        
        END DESC
      `;
  return allP(db, q);
}
