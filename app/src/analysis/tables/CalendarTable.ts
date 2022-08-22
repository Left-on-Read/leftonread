import log from 'electron-log';

import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { Table, TableNames } from './types';

// TODO(Danilowicz): We do not need to create from 2000 to 2157, just the min and max of
// human_readable_date on the core main table.
export class CalendarTable extends Table {
  async create(): Promise<TableNames> {
    await sqlite3Wrapper.runP(
      this.db,
      `create table ${this.name} (id integer primary key);`
    );
    await sqlite3Wrapper.runP(
      this.db,
      `insert into ${this.name} default values;`
    );
    await sqlite3Wrapper.runP(
      this.db,
      `insert into ${this.name} default values;`
    );
    await sqlite3Wrapper.runP(
      this.db,
      `insert into ${this.name} select null from ${this.name} d1, ${this.name} d2, ${this.name} d3 , ${this.name} d4;`
    );
    await sqlite3Wrapper.runP(
      this.db,
      `insert into ${this.name} select null from ${this.name} d1, ${this.name} d2, ${this.name} d3 , ${this.name} d4;`
    );
    await sqlite3Wrapper.runP(
      this.db,
      `alter table ${this.name} add date datetime;`
    );
    await sqlite3Wrapper.runP(
      this.db,
      `update ${this.name} set date=date('2000-01-01',(-1+id)||' day'); `
    );

    log.info(`INFO: created ${this.name}`);
    return this.name;
  }
}
