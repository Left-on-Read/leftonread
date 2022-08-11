import { filterOutReactions } from '../../constants/filters';
import { objReplacementUnicode } from '../../constants/objReplacementUnicode';
import log from 'electron-log';

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
   FROM message msg)
    -- TODO(Danilowicz): instead of * we should just grab the columns we need
    SELECT
      *
    FROM chat_message_join cmj
    JOIN chat_handle_join chj
      ON  chj.chat_id = cmj.chat_id
    JOIN handle h
      ON h.ROWID = chj.handle_id
    JOIN message m
      ON m.ROWID = cmj.message_id
    JOIN DATE_TIME_TABLE
      ON guid = datetimetable_guid 
    WHERE ${fluffFilter()}
    -- it seems that texts sent and received in group chats are sent N times
    -- where N is the number of contacts in the chat. So we GROUP BY guid
    GROUP BY guid
    `;

    await sqlite3Wrapper.runP(this.db, q);
    log.info(`INFO: created ${this.name}`);
    return this.name;
  }
}
