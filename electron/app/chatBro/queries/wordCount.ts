import * as sqlite3 from 'sqlite3';
import * as _ from 'lodash';
import * as sqlite3Wrapper from '../util/sqliteWrapper';
import { reactions } from '../constants/reactions';
import { emojis } from '../constants/emojis';
import { stopWords } from '../constants/stopWords';
import { objReplacementUnicode } from '../constants/objReplacementUnicode';
import { punctuation } from '../constants/punctuation';
import { ChatBro, WordCount } from '../definitions';

export async function createWordTable(db: sqlite3.Database) {
  const q = `
    CREATE TABLE ${ChatBro.Tables.WORD_TABLE} AS
    WITH RECURSIVE SPLIT_TEXT_TABLE (id, is_from_me, guid, text, etc) AS
    (
      SELECT
        h.id, m.is_from_me, m.guid, '', m.text || ' '
      FROM message m
      JOIN
      handle h
      ON
      h.ROWID = handle_id
      WHERE m.text IS NOT NULL
      UNION ALL
      SELECT
        id, is_from_me, guid, SUBSTR(etc, 0, INSTR(etc, ' ')), SUBSTR(etc, INSTR(etc, ' ')+1)
      FROM SPLIT_TEXT_TABLE
      WHERE etc <> ''
    )
      SELECT
        id as contact_number, text as word, is_from_me, COUNT(text) as ${WordCount.Columns.COUNT}
      FROM SPLIT_TEXT_TABLE
        WHERE TRIM(LOWER(text)) NOT IN (${stopWords})
        AND TRIM(text) NOT IN (${reactions})
        AND TRIM(text) NOT IN (${emojis})
        AND unicode(TRIM(LOWER(text))) != ${objReplacementUnicode}
        AND TRIM(text) NOT IN (${punctuation})
      GROUP BY id, text, is_from_me;
  `;
  return sqlite3Wrapper.runP(db, q);
}

// ***** Filter functions ***** //
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
  return !_.isEmpty(filtersArray) ? `WHERE ${filtersArray.join(' AND ')}` : ``;
}

export async function getWordCount(
  db: sqlite3.Database,
  tableName: ChatBro.Tables.WORD_TABLE,
  opts: WordCountTypes.Options = {}
): Promise<WordCountTypes.Results> {
  const limit = opts.limit || 5;
  const filters = getAllFilters(opts);
  const query = `
    SELECT SUM(${WordCount.Columns.COUNT}) as count,
    ${WordCount.Columns.WORD}
    FROM ${tableName}
    ${filters}
    GROUP BY ${WordCount.Columns.WORD}
    ORDER BY ${WordCount.Columns.COUNT} DESC
    LIMIT ${limit}
  `;

  return sqlite3Wrapper.allP(db, query);
}
