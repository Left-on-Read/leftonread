import log from 'electron-log';

import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { TableNames, Table } from './types';

export class CoreMainTable extends Table {
  async create(): Promise<TableNames> {
    const q = `
    CREATE TABLE ${this.name} AS
    -- TODO: instead of * we should just grab the columns we need
    SELECT
      *
    FROM chat_message_join cmj
    JOIN chat_handle_join chj
      ON  chj.chat_id = cmj.chat_id
    JOIN handle h
      ON h.ROWID = chj.handle_id
    JOIN message m
      ON m.ROWID = cmj.message_id
  `;
    await sqlite3Wrapper.runP(this.db, q);
    log.info(`INFO: created ${this.name}`);
    return this.name;
  }
}
