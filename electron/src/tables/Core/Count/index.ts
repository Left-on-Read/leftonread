import log from 'electron-log';
import { reactions } from '../../../chatBro/constants/reactions';
import { stopWords } from '../../../chatBro/constants/stopWords';
import { objReplacementUnicode } from '../../../chatBro/constants/objReplacementUnicode';
import { punctuation } from '../../../chatBro/constants/punctuation';
import { Columns as ContactNameColumns } from '../../ContactTable';

import * as sqlite3Wrapper from '../../../utils/initUtils/sqliteWrapper';
import { TableNames } from '../../definitions';
import { Table } from '../../Table';

export const Columns = {
  WORD: 'word',
  COUNT: 'count',
};

export class CoreCountTable extends Table {
  async create(): Promise<TableNames> {
    const q = `
    CREATE TABLE ${this.name} AS
    WITH RECURSIVE SPLIT_TEXT_TABLE (id, is_from_me, guid, text, etc) AS
    (
      SELECT
        coalesce(h.${ContactNameColumns.CONTACT_NAME}, h.id) as id, m.is_from_me, m.guid, '', m.text || ' '
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
        id as contact,
        text as ${Columns.WORD},
        is_from_me,
        COUNT(text) as ${Columns.COUNT}
      FROM SPLIT_TEXT_TABLE
      WHERE TRIM(LOWER(text)) NOT IN (${stopWords})
        AND TRIM(text) NOT IN (${reactions})
        AND unicode(TRIM(LOWER(text))) != ${objReplacementUnicode}
        AND TRIM(text) NOT IN (${punctuation})
      GROUP BY id, text, is_from_me;
  `;
    await sqlite3Wrapper.runP(this.db, q);
    log.info(`Created ${this.name}`);
    return this.name;
  }
}
