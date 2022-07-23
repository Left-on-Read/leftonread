import * as sqlite3 from 'sqlite3';

import { ChatTableNames } from '../../../tables';
import * as sqlite3Wrapper from '../../../utils/initUtils/sqliteWrapper';
import { DEFAULT_LIMIT } from '../../constants/filters';
import { Columns, OutputColumns } from './columns';
import getAllFilters from './filters';
import { IWordOrEmojiFilters, TWordOrEmojiResults } from './types';

export async function queryEmojiOrWordCounts(
  db: sqlite3.Database,
  filters: IWordOrEmojiFilters
): Promise<TWordOrEmojiResults> {
  const limit = filters.limit || DEFAULT_LIMIT;
  const allFilters = getAllFilters(filters);
  const query = `
    WITH COUNT_TEXT_TB AS (
      SELECT
        COUNT(${Columns.WORD}) as ${OutputColumns.COUNT},
        ${Columns.WORD},
        ${Columns.CONTACT},
        ${Columns.IS_FROM_ME}
      FROM ${ChatTableNames.COUNT_TABLE}
        ${allFilters}
      GROUP BY ${Columns.CONTACT}, ${Columns.WORD}, ${Columns.IS_FROM_ME}
    )

    SELECT
      SUM(${OutputColumns.COUNT}) as ${OutputColumns.COUNT},
      ${Columns.WORD} as ${OutputColumns.WORD}
    FROM
      COUNT_TEXT_TB
    GROUP BY ${Columns.WORD}
    ORDER BY ${OutputColumns.COUNT} DESC
    LIMIT ${limit}
  `;

  return sqlite3Wrapper.allP(db, query);
}
