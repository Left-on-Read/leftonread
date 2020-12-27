import { Table } from './Table';
import * as sqlite3Wrapper from '../utils/initUtils/sqliteWrapper';
import { reactions } from '../chatBro/constants/reactions';
import { emojis } from '../chatBro/constants/emojis';
import { stopWords } from '../chatBro/constants/stopWords';
import { objReplacementUnicode } from '../chatBro/constants/objReplacementUnicode';
import { punctuation } from '../chatBro/constants/punctuation';
import { TableNames } from './definitions';

export const Columns = {
  WORD: 'word',
  COUNT: 'count',
};

export class WordCountTable extends Table {
  async create(): Promise<TableNames> {
    const q = `
    CREATE TABLE ${this.name} AS
    WITH RECURSIVE SPLIT_TEXT_TABLE (id, is_from_me, guid, text, etc) AS
    (
      SELECT
        coalesce(h.contact_name, h.id) as id, m.is_from_me, m.guid, '', m.text || ' '
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
        id as contact, text as word, is_from_me, COUNT(text) as ${Columns.COUNT}
      FROM SPLIT_TEXT_TABLE
        WHERE TRIM(LOWER(text)) NOT IN (${stopWords})
        AND TRIM(text) NOT IN (${reactions})
        AND TRIM(text) NOT IN (${emojis})
        AND unicode(TRIM(LOWER(text))) != ${objReplacementUnicode}
        AND TRIM(text) NOT IN (${punctuation})
      GROUP BY id, text, is_from_me;
  `;
    await sqlite3Wrapper.runP(this.db, q);
    return this.name;
  }
}
