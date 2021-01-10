import { Table } from './Table';
import * as sqlite3Wrapper from '../utils/initUtils/sqliteWrapper';
import { TableNames } from './definitions';

export const Columns = {
  COUNT: 'count',
  PHONE_NUMBER: 'phone_number',
  FRIEND: 'friend',
  IS_FROM_ME: 'sent',
};

export class TopFriendsTable extends Table {
  async create(): Promise<TableNames> {
    const q = `
    CREATE TABLE ${this.name} AS
    SELECT
      COUNT(*) as ${Columns.COUNT},
      h.id as ${Columns.PHONE_NUMBER},
      COALESCE(h.contact_name, h.id) as ${Columns.FRIEND},
      is_from_me as ${Columns.IS_FROM_ME}
    FROM message
      JOIN handle h
    ON h.ROWID = handle_id
    -- NOTE: Excludes group chats
    WHERE message.cache_roomnames IS NULL
      GROUP BY h.id, is_from_me`;
    await sqlite3Wrapper.runP(this.db, q);
    return this.name;
  }
}
