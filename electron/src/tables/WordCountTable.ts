import log from 'electron-log';
import { Table } from './Table';
import * as sqlite3Wrapper from '../utils/initUtils/sqliteWrapper';
import { TableNames, ChatTableNames } from './definitions';
import { emojis } from '../chatBro/constants/emojis';
import { Columns as CoreCountColumns } from './Core/Count';

export const Columns = CoreCountColumns;

export class WordCountTable extends Table {
  async create(): Promise<TableNames> {
    const q = `
    CREATE TABLE ${this.name} AS
      SELECT
      *
      FROM
      ${ChatTableNames.CORE_COUNT_TABLE}
      WHERE TRIM(word_or_emoji) NOT IN (${emojis})
    `;
    await sqlite3Wrapper.runP(this.db, q);
    log.info(`Created ${this.name}`);
    return this.name;
  }
}
