import * as sqlite3 from 'sqlite3';
import { DEFAULT_LIMIT } from '../../constants/filters';

import * as sqlite3Wrapper from '../../../utils/initUtils/sqliteWrapper';
import { ChatTableNames } from '../../../tables';
import { Columns, OutputColumns } from './columns';
import getAllFilters from './filters';

export async function queryEmojiOrWordCounts(
  db: sqlite3.Database,
  filters: WordOrEmojiTypes.Filters
): Promise<WordOrEmojiTypes.Results> {
  const limit = filters.limit || DEFAULT_LIMIT;
  const allFilters = getAllFilters(filters);
  const query = `
    SELECT
      SUM(${Columns.COUNT}) as ${OutputColumns.COUNT},
      ${Columns.WORD} as ${OutputColumns.WORD}
    FROM
      ${ChatTableNames.CORE_COUNT_TABLE}
    ${allFilters}
    GROUP BY ${Columns.WORD}
    ORDER BY ${Columns.COUNT} DESC
    LIMIT ${limit}
  `;

  return sqlite3Wrapper.allP(db, query);
}
