import * as _ from 'lodash';
import * as sqlite3 from 'sqlite3';
import { emojis } from '../../constants/emojis';

import * as sqlite3Wrapper from '../../../utils/initUtils/sqliteWrapper';
import { ChatTableNames } from '../../../tables';
import { Columns } from '../../../tables/Core/Count';

function isFromMeFilter(filters: WordOrEmojiTypes.Filters): string {
  if (filters.isFromMe === true) {
    return `${Columns.IS_FROM_ME} = 1`;
  }
  return `${Columns.IS_FROM_ME} = 0`;
}

function wordFilter(filters: WordOrEmojiTypes.Filters): string | undefined {
  if (_.isEmpty(filters.word)) {
    return undefined;
  }
  return `${Columns.WORD} = "${filters.word}"`;
}

function isEmojiFilter(filters: WordOrEmojiTypes.Filters): string {
  if (filters.isEmoji === true) {
    return `TRIM(${Columns.WORD}) IN (${emojis})`;
  }
  return `TRIM(${Columns.WORD}) NOT IN (${emojis})`;
}

// Attaches each filter in a combined WHERE clause.
function getAllFilters(filters: WordOrEmojiTypes.Filters): string {
  const isEmoji = isEmojiFilter(filters);
  const isFromMe = isFromMeFilter(filters);
  const word = wordFilter(filters);
  const filtersArray = _.compact([isFromMe, word, isEmoji]);
  return !_.isEmpty(filtersArray) ? `WHERE ${filtersArray.join(' AND ')}` : '';
}

export async function queryEmojiOrWordCounts(
  db: sqlite3.Database,
  filters: WordOrEmojiTypes.Filters = { isEmoji: false, isFromMe: true }
): Promise<WordOrEmojiTypes.Results> {
  const limit = filters.limit || 15;
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
