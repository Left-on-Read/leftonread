import { Table } from './Table'
import * as sqlite3Wrapper from '../util/sqliteWrapper';
import { reactions } from '../constants/reactions';
import { emojis } from '../constants/emojis';
import { stopWords } from '../constants/stopWords';
import { objReplacementUnicode } from '../constants/objReplacementUnicode';
import { punctuation } from '../constants/punctuation';
import { ChatBro, WordCount } from '../definitions';
import { TableNames } from './definitions'

export class WordCountTable extends Table {
  async create(): Promise<TableNames> {
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
    await sqlite3Wrapper.runP(this.db, q);
    return this.name
  }
}