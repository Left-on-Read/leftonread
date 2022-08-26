import log from 'electron-log';

import { filterOutReactions } from '../../constants/filters';
import { objReplacementUnicode } from '../../constants/objReplacementUnicode';
import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { Table, TableNames } from './types';

// subset of columns, just to have in an enum
export enum CoreMainTableColumns {
  DATE = 'human_readable_date',
}

/**
 * Removes reactions, empty texts, and weird character objReplacement character
 * @returns string
 */
export function fluffFilter(): string {
  return `
    ${filterOutReactions()} AND unicode(TRIM(text)) != ${objReplacementUnicode}
    AND text IS NOT NULL
    AND LENGTH(text) >= 1`;
}

export class CoreMainTable extends Table {
  async create(): Promise<TableNames> {
    const q = `
    CREATE TABLE IF NOT EXISTS ${this.name} AS

    WITH DATE_TIME_TABLE AS
    (SELECT 
    guid as datetimetable_guid,
    CASE 
       WHEN msg.date > 10000000000
       THEN 
          -- msg.date is the time elapsed in nanoseconds since 1/1/2001.
          -- We then convert it to our localtime
          -- Not sure why this is 1 hour ahead though, even in UTC time
          -- See: https://apple.stackexchange.com/questions/114168/dates-format-in-messages-chat-db
           datetime((msg.date/1000000000) + strftime('%s','2001-01-01 01:01:01'), 'unixepoch', 'localtime')
       ELSE 
           datetime(msg.date + strftime('%s','2001-01-01 01:01:01'), 'unixepoch', 'localtime')
       END AS human_readable_date 
   FROM message msg),
   GROUP_CHAT_PARTICIPANTS_TABLE AS (
    SELECT GROUP_CONCAT(contact_name) as group_chat_participants,
    display_name,
    room_name,
    chat_id
    FROM chat 
    JOIN  chat_handle_join 
    ON chat.ROWID = chat_id 
    JOIN handle 
    ON handle_id = handle.ROWID 
    WHERE room_name IS NOT NULL
    GROUP BY room_name)
    -- TODO(Danilowicz): instead of * we should just grab the columns we need
    SELECT
      *,
      COALESCE(contact_name, id, group_chat_participants) as contact_name_with_group_chat_participants_populated,
      m.ROWID as message_id
    FROM
    message m
    -- The left join is important here, because handle_id 0 is used when you send group messages
    LEFT JOIN handle h 
      ON h.rowid = m.handle_id

    JOIN DATE_TIME_TABLE
      ON m.guid = datetimetable_guid 

    LEFT JOIN chat_message_join c
      ON c.message_id = m.ROWID
    JOIN chat cc
      ON cc.ROWID = c.chat_id
    -- LEFT JOIN is important here because not everyone has a room_name
	  LEFT JOIN GROUP_CHAT_PARTICIPANTS_TABLE gct
    -- very important to join on the message and not the chat which is duplicated
		ON cc.ROWID = gct.chat_id
    WHERE ${fluffFilter()}
    `;

    await sqlite3Wrapper.runP(this.db, q);
    log.info(`INFO: created ${this.name}`);

    // NOTE(teddy): Delete duplicate message_Id rows... not sure how they get in tehre...
    // THIS DOES NOT WORk. I DONT KNOW WHY.
    const deleteDupsQ = `
      DELETE FROM ${this.name} 
      WHERE ROWID NOT IN 
      (
        SELECT min(ROWID)
        FROM ${this.name}
        GROUP BY ROWID
      )
    `;
    await sqlite3Wrapper.runP(this.db, deleteDupsQ);
    log.info(`INFO: cleared any duplicates from ${this.name}`);

    return this.name;
  }
}
