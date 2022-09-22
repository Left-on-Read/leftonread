import log from 'electron-log';

import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { Table, TableNames } from './types';

export class GroupChatCoreTable extends Table {
  async create(): Promise<TableNames> {
    const q = `
      CREATE TABLE IF NOT EXISTS ${this.name} AS
      
      WITH GROUP_CHAT_NAMES AS (select
        group_concat(distinct coalesced_contact_name) as participants,
        display_name,
        cmj.chat_id
        from
            chat c
            join chat_message_join cmj on cmj.chat_id = c."ROWID"
            join core_main_table m on m. "ROWID" = cmj.message_id
        group by
            c."ROWID"
        having
            count(distinct coalesced_contact_name) > 1),
    
        GC_CORE_TABLE AS (SELECT 
        text,
        display_name,
        human_readable_date,
        coalesce(coalesced_contact_name, "you") as contact_name, 
        participants, is_from_me, 
        associated_message_type,
        CASE WHEN display_name = "" THEN participants ELSE display_name END as group_chat_name ,
        REPLACE(REPLACE(associated_message_guid, "p:0/", ""), "p:1/", "")as associated_guid
        FROM core_main_table cm
        JOIN GROUP_CHAT_NAMES gcm
        on cm.chat_id  = gcm.chat_id)

        SELECT * FROM GC_CORE_TABLE WHERE group_chat_name IS NOT NULL AND contact_name IS NOT NULL
    `;

    await sqlite3Wrapper.runP(this.db, q);
    log.info(`INFO: created ${this.name}`);
    return this.name;
  }
}
