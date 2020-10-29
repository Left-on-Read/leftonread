import * as sqlite3 from 'sqlite3';
import * as _ from 'lodash';
import * as sqlite3Wrapper from '../util/sqliteWrapper';
import { reactions } from '../constants/reactions';
import { emojis } from '../constants/emojis';
import { stopWords } from '../constants/stopWords';
import { objReplacementUnicode } from '../constants/objReplacementUnicode';
import { punctuation } from '../constants/punctuation';

export async function createWordTable(db: sqlite3.Database, tableName: string) {
  const q = `
    CREATE TABLE ${tableName} AS
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
        id as contact_number, text as word, is_from_me, COUNT(text) as count
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
function isFromMeFilter(opts: chatBro.WordCountOptions): string | undefined {
  if (opts.isFromMe === true) {
    return `is_from_me = 1`;
  }
  if (opts.isFromMe === false) {
    return `is_from_me = 0`;
  }
  return undefined;
}

function wordFilter(opts: chatBro.WordCountOptions): string | undefined {
  if (_.isEmpty(opts.word)) {
    return undefined;
  }
  return `word = "${opts.word}"`;
}

// Attaches each filter in a combined WHERE clause.
function getAllFilters(opts: chatBro.WordCountOptions): string {
  const isFromMe = isFromMeFilter(opts);
  const word = wordFilter(opts);
  const filtersArray = _.compact([isFromMe, word]);
  return !_.isEmpty(filtersArray) ? `WHERE ${filtersArray.join(' AND ')}` : ``;
}

export async function getWordCount(
  db: sqlite3.Database,
  tableName: string,
  opts: chatBro.WordCountOptions = {}
): Promise<
  {
    word: string;
    count: number;
  }[]
> {
  const filters = getAllFilters(opts);
  // TODO: limit here should be something you pass in
  const query = `
    SELECT SUM(count) as count, word FROM ${tableName}
    ${filters}
    GROUP BY word
    ORDER BY count DESC
    LIMIT 5
  `;

  return sqlite3Wrapper.allP(db, query);
}
