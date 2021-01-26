import * as sqlite3 from 'sqlite3';
import { DEFAULT_LIMIT } from '../../constants/defaultFilters';

import * as sqlite3Wrapper from '../../../utils/initUtils/sqliteWrapper';
import { ChatTableNames } from '../../../tables';
import { Columns } from '../../../tables/Core/Count';
import getAllFilters from './filters';

export async function queryEmojiOrWordCounts(
  db: sqlite3.Database,
  filters: WordOrEmojiTypes.Filters = { isEmoji: false, isFromMe: true }
): Promise<WordOrEmojiTypes.Results> {
  const limit = filters.limit || DEFAULT_LIMIT;
  const allFilters = getAllFilters(filters);
  const query = `
    SELECT
      SUM(${Columns.COUNT}) as ${Columns.COUNT},
      ${Columns.WORD}
    FROM
      ${ChatTableNames.CORE_COUNT_TABLE}
    ${allFilters}
    GROUP BY ${Columns.WORD}
    ORDER BY ${Columns.COUNT} DESC
    LIMIT ${limit}
  `;

  return sqlite3Wrapper.allP(db, query);
}
