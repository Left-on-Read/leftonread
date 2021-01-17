import * as _ from 'lodash';
import * as sqlite3 from 'sqlite3';
import { emojis } from '../../constants/emojis';

import * as sqlite3Wrapper from '../../../utils/initUtils/sqliteWrapper';
import { ChatTableNames } from '../../../tables';
import { Columns } from '../../../tables/Core/Count';

function isFromMeFilter(opts: WordCountTypes.Options): string {
  if (opts.isFromMe === true) {
    return `${Columns.IS_FROM_ME} = 1`;
  }
  return `${Columns.IS_FROM_ME} = 0`;
}

function wordFilter(opts: WordCountTypes.Options): string | undefined {
  if (_.isEmpty(opts.word)) {
    return undefined;
  }
  return `${Columns.WORD} = "${opts.word}"`;
}

function isEmojiFilter(opts: WordCountTypes.Options): string {
  if (opts.isEmoji === true) {
    return `TRIM(${Columns.WORD}) IN (${emojis})`;
  }
  return `TRIM(${Columns.WORD}) NOT IN (${emojis})`;
}

// Attaches each filter in a combined WHERE clause.
function getAllFilters(opts: WordCountTypes.Options): string {
  const isEmoji = isEmojiFilter(opts);
  const isFromMe = isFromMeFilter(opts);
  const word = wordFilter(opts);
  const filtersArray = _.compact([isFromMe, word, isEmoji]);
  return !_.isEmpty(filtersArray) ? `WHERE ${filtersArray.join(' AND ')}` : '';
}

export async function queryEmojiOrWordCounts(
  db: sqlite3.Database,
  opts: WordCountTypes.Options = { isEmoji: false, isFromMe: true }
): Promise<WordCountTypes.Results> {
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
