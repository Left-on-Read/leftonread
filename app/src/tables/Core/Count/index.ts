import log from 'electron-log';

import * as sqlite3Wrapper from '../../../utils/initUtils/sqliteWrapper';
import { Columns as ContactNameColumns } from '../../ContactTable';
import { TableNames } from '../../definitions';
import { Table } from '../../Table';

export enum Columns {
  WORD = 'word',
  CACHE_ROOMNAMES = 'cache_roomnames',
  IS_FROM_ME = 'is_from_me',
  CONTACT = 'contact',
}

export class CoreCountTable extends Table {
  async create(): Promise<TableNames> {
    const q = `
    CREATE TABLE ${this.name} AS
    WITH RECURSIVE SPLIT_TEXT_TABLE (cache_roomnames, id, is_from_me, guid, text, etc) AS
    (
      SELECT
        m.cache_roomnames,
        coalesce(h.${ContactNameColumns.CONTACT_NAME}, h.id) as id,
        m.is_from_me,
        m.guid, '',
        m.text || ' '
      FROM chat_message_join cmj
        JOIN chat_handle_join chj
          ON  chj.chat_id = cmj.chat_id
        JOIN handle h
          ON h.ROWID = chj.handle_id
        JOIN message m
          ON m.ROWID = cmj.message_id
        WHERE m.text IS NOT NULL
      UNION ALL
      SELECT
        cache_roomnames, id, is_from_me, guid, SUBSTR(etc, 0, INSTR(etc, ' ')), SUBSTR(etc, INSTR(etc, ' ')+1)
      FROM SPLIT_TEXT_TABLE
      WHERE etc <> ''
    )
      SELECT
        id as ${Columns.CONTACT},
        LOWER(text) as ${Columns.WORD},
        is_from_me as ${Columns.IS_FROM_ME},
        cache_roomnames as ${Columns.CACHE_ROOMNAMES}
      FROM SPLIT_TEXT_TABLE
  `;
    await sqlite3Wrapper.runP(this.db, q);
    log.info(`INFO: created ${this.name}`);
    return this.name;
  }
}
