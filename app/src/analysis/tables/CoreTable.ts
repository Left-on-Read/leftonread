import log from 'electron-log';

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
    unicode(TRIM(text)) != ${objReplacementUnicode}
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
   FROM message msg)
    -- TODO(Danilowicz): instead of * we should just grab the columns we need
    SELECT
      *,
      m.ROWID as message_id,
      -- TODO(Danilowicz): every query should just use coalesced_contact_name
      -- instead of coalescing themselves
      coalesce(contact_name, id) as coalesced_contact_name
    -- Some texts sent to individuals 
    -- dont show up unless
    -- you take the ROWID of the message
    -- get the chat_id
    -- get the handle_id,
    -- then join to the handle table.
    -- It's not enough to simply join on the handle table.
    -- Also, when you send a group message
    -- it is assigned a handle_id of 0
    -- and handle_id of 0 is not present in the join tables.

    FROM message m
    LEFT JOIN chat_message_join cmj
    ON
    m.ROWID = cmj.message_id
    LEFT JOIN chat_handle_join chj
    USING(chat_id)
    LEFT JOIN handle h
    -- if it's a group chat, then join using the message table
    ON CASE WHEN m.cache_roomnames IS NOT NULL AND h.ROWID = m.handle_id THEN 1
    -- if it's NOT group chat, then join using the chj table, which tends to have missing data 
    WHEN  m.cache_roomnames IS NULL AND h.ROWID = chj.handle_id  THEN 1
    ELSE 0
    END = 1



    JOIN DATE_TIME_TABLE
      ON m.guid = datetimetable_guid 
    WHERE ${fluffFilter()}

    -- remove duplicate messages from group chats
    GROUP BY guid 
    `;

    await sqlite3Wrapper.runP(this.db, q);
    log.info(`INFO: created ${this.name}`);

    return this.name;
  }
}
