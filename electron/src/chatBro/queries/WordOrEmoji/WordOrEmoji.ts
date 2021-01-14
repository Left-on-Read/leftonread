import * as _ from 'lodash';
import * as sqlite3 from 'sqlite3';
import { emojis } from '../../constants/emojis';

import * as sqlite3Wrapper from '../../../utils/initUtils/sqliteWrapper';
import { ChatTableNames } from '../../../tables';
import { Columns } from '../../../tables/Core/Count';

function isFromMeFilter(opts: WordOrEmojiTypes.Options): string | undefined {
  if (opts.isFromMe === true) {
    return `${Columns.IS_FROM_ME} = 1`;
  }
  if (opts.isFromMe === false) {
    return `${Columns.IS_FROM_ME} = 0`;
  }
  return undefined;
}

function wordFilter(opts: WordOrEmojiTypes.Options): string | undefined {
  if (_.isEmpty(opts.word)) {
    return undefined;
  }
  return `${Columns.WORD} = "${opts.word}"`;
}

function isEmojiFilter(opts: WordOrEmojiTypes.Options): string | undefined {
  if (opts.isEmoji === true) {
    return `TRIM(${Columns.WORD}) IN (${emojis})`;
  }
  if (opts.isEmoji === false) {
    return `TRIM(${Columns.WORD}) NOT IN (${emojis})`;
  }
  return undefined;
}

// Attaches each filter in a combined WHERE clause.
function getAllFilters(opts: WordOrEmojiTypes.Options): string {
  const isEmoji = isEmojiFilter(opts);
  const isFromMe = isFromMeFilter(opts);
  const word = wordFilter(opts);
  const filtersArray = _.compact([isFromMe, word, isEmoji]);
  return !_.isEmpty(filtersArray) ? `WHERE ${filtersArray.join(' AND ')}` : '';
}

export async function queryEmojiOrWordCounts(
  db: sqlite3.Database,
  opts: WordOrEmojiTypes.Options = {}
): Promise<WordOrEmojiTypes.Results> {
  const limit = opts.limit || 15;
  const filters = getAllFilters(opts);
  const query = `
    SELECT
      SUM(${Columns.COUNT}) as ${Columns.COUNT},
      ${Columns.WORD}
    FROM
      ${ChatTableNames.CORE_COUNT_TABLE}
    ${filters}
    GROUP BY ${Columns.WORD}
    ORDER BY ${Columns.COUNT} DESC
    LIMIT ${limit}
  `;

  return sqlite3Wrapper.allP(db, query);
}
