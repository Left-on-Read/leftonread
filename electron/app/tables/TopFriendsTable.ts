import { Table } from './Table';
import * as sqlite3Wrapper from '../utils/initUtils/sqliteWrapper';
import { TableNames } from './definitions';

export const Columns = {
  COUNT: 'count',
  PHONE_NUMBER: 'phone_number',
  FRIEND: 'friend'
};

export class TopFriendsTable extends Table {
  async create(): Promise<TableNames> {
    const q = `
    CREATE TABLE ${this.name} AS
    SELECT
      COUNT(*) as ${Columns.COUNT},
      h.id as ${Columns.PHONE_NUMBER},
      COALESCE(h.contact_name, h.id) as ${Columns.FRIEND}
    FROM message
      JOIN handle h
    ON h.ROWID = handle_id
    WHERE message.cache_roomnames IS NULL
      GROUP BY h.id`;
    await sqlite3Wrapper.runP(this.db, q);
    return this.name;
  }
}
