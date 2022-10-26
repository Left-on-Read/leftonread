import log from 'electron-log';

import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { Columns as ContactNameColumns } from './ContactTable';
import { CoreTableNames, Table, TableNames } from './types';

export enum ChatTableColumns {
  WORD = 'word',
  CACHE_ROOMNAMES = 'cache_roomnames',
  IS_FROM_ME = 'is_from_me',
  CONTACT = 'contact',
  DATE = 'human_readable_date',
}

// TODO(Danilowicz): I think this should be renamed WordTable
export class ChatCountTable extends Table {
  async create(): Promise<TableNames> {
    const q = `
      CREATE TABLE ${this.name} AS
      WITH RECURSIVE SPLIT_TEXT_TABLE (human_readable_date, cache_roomnames, id, is_from_me, guid, text, etc) AS
      (
        SELECT
          m.human_readable_date,
          m.cache_roomnames,
          coalesce(m.${ContactNameColumns.CONTACT_NAME}, m.id) as id,
          m.is_from_me,
          m.guid, '',
          m.text || ' '
        -- NOTE(Danilowicz): when creating the core main table we already filter for fluff
        FROM ${CoreTableNames.CORE_MAIN_TABLE} m
        UNION ALL
        SELECT
        human_readable_date, cache_roomnames, id, is_from_me, guid, SUBSTR(etc, 0, INSTR(etc, ' ')), SUBSTR(etc, INSTR(etc, ' ')+1)
        FROM SPLIT_TEXT_TABLE
        WHERE etc <> ''
      )
        SELECT
          human_readable_date as ${ChatTableColumns.DATE},
          id as ${ChatTableColumns.CONTACT},
          LOWER(text) as ${ChatTableColumns.WORD},
          is_from_me as ${ChatTableColumns.IS_FROM_ME},
          cache_roomnames as ${ChatTableColumns.CACHE_ROOMNAMES}
        FROM SPLIT_TEXT_TABLE
    `;

    await sqlite3Wrapper.runP(this.db, q);
    log.info(`INFO: created ${this.name}`);
    return this.name;
  }
}
