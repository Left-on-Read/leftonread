import { Table } from './Table';
import * as sqlite3Wrapper from '../utils/initUtils/sqliteWrapper';
import { TableNames } from './definitions';
import getCoreCountTable from './Core/Count';

export const Columns = {
  WORD: 'word',
  COUNT: 'count',
};

export class WordCountTable extends Table {
  async create(): Promise<TableNames> {
    const q = `
    CREATE TABLE ${this.name} AS ${getCoreCountTable(Columns, false)}`;
    await sqlite3Wrapper.runP(this.db, q);
    return this.name;
  }
}
