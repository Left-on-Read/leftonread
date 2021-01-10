import * as _ from 'lodash';
import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../../utils/initUtils/sqliteWrapper';
import { ChatTableNames } from '../../../tables';
import { Columns } from '../../../tables/WordCountTable';

function isFromMeFilter(opts: WordCountTypes.Options): string | undefined {
  if (opts.isFromMe === true) {
    return `is_from_me = 1`;
  }
  if (opts.isFromMe === false) {
    return `is_from_me = 0`;
  }
  return undefined;
}

function wordFilter(opts: WordCountTypes.Options): string | undefined {
  if (_.isEmpty(opts.word)) {
    return undefined;
  }
  return `word = "${opts.word}"`;
}

// Attaches each filter in a combined WHERE clause.
function getAllFilters(opts: WordCountTypes.Options): string {
  const isFromMe = isFromMeFilter(opts);
  const word = wordFilter(opts);
  const filtersArray = _.compact([isFromMe, word]);
  return !_.isEmpty(filtersArray) ? `WHERE ${filtersArray.join(' AND ')}` : '';
}

export async function queryWordCounts(
  db: sqlite3.Database,
  tableName: ChatTableNames.WORD_TABLE,
  opts: WordCountTypes.Options = {}
): Promise<WordCountTypes.Results> {
  const limit = opts.limit || 10;
  const filters = getAllFilters(opts);
  const query = `
    SELECT SUM(${Columns.COUNT}) as ${Columns.COUNT},
    ${Columns.WORD}
    FROM ${tableName}
    ${filters}
    GROUP BY ${Columns.WORD}
    ORDER BY ${Columns.COUNT} DESC
    LIMIT ${limit}
  `;

  return sqlite3Wrapper.allP(db, query);
}
