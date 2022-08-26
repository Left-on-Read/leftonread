import log from 'electron-log';

import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { Columns as ContactNameColumns } from './ContactTable';
import { CoreTableNames, Table, TableNames } from './types';

// TODO(Danilowicz): I think this should be renamed WordTable. Horribly named.
export class ChatCountTable extends Table {
  async create(): Promise<TableNames> {
    const q = `
      CREATE TABLE ${this.name} AS
      WITH RECURSIVE SPLIT_TEXT_TABLE (room_name, id, contact_name_with_group_chat_participants_populated, is_from_me, guid, text, etc) AS
      (
        SELECT
          m.room_name,
          coalesce(m.${ContactNameColumns.CONTACT_NAME}, m.id) as id,
          m.contact_name_with_group_chat_participants_populated,
          m.is_from_me,
          m.guid, '',
          m.text || ' '
        -- NOTE(Danilowicz): when creating the core main table we already filter for fluff
        FROM ${CoreTableNames.CORE_MAIN_TABLE} m
        UNION ALL
        SELECT
        room_name, id, contact_name_with_group_chat_participants_populated, is_from_me, guid, SUBSTR(etc, 0, INSTR(etc, ' ')), SUBSTR(etc, INSTR(etc, ' ')+1)
        FROM SPLIT_TEXT_TABLE
        WHERE etc <> ''
      )
        SELECT
          id as contact,
          contact_name_with_group_chat_participants_populated,
          LOWER(text) as word,
          is_from_me,
          room_name
        FROM SPLIT_TEXT_TABLE
    `;

    await sqlite3Wrapper.runP(this.db, q);
    log.info(`INFO: created ${this.name}`);
    return this.name;
  }
}
