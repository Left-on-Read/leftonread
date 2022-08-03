import log from 'electron-log';

import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { Table, TableNames } from './types';

// subset of columns, just to have in an enum
export enum CoreMainTableColumns {
  DATE = 'human_readable_date',
}

export class CoreMainTable extends Table {
  async create(): Promise<TableNames> {
    const q = `
    CREATE TABLE IF NOT EXISTS ${this.name} AS

    WITH DATE_TIME_TABLE AS
    -- TODO(Danilowicz): I don't fully understanding how leftonread_date is calculated here
    -- but it works. If someone could explain it, that would be greatly appreciated!
    (SELECT 
    guid as datetimetable_guid,
    CASE 
       WHEN msg.date > 10000000000
       THEN 
          -- Compute the date and time given a unix timestamp (msg.date) + , and compensate for your local timezone.
          -- See: https://apple.stackexchange.com/questions/114168/dates-format-in-messages-chat-db
           substr(datetime((msg.date/1000000000) + strftime('%s','2001-01-01 01:01:01'), 'unixepoch', 'localtime'), 0, 20)
       ELSE 
           substr(datetime(msg.date + strftime('%s','2001-01-01 01:01:01'), 'unixepoch', 'localtime'), 0, 20)
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
    `;

    await sqlite3Wrapper.runP(this.db, q);
    log.info(`INFO: created ${this.name}`);
    return this.name;
  }
}
