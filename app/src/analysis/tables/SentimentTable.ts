import log from 'electron-log';

import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { Table, TableNames } from './types';

// subset of columns, just to have in an enum
export enum SentimentTableColumns {
  happyCount = 'happy_count',
  loveCount = 'love_count',
  angerCount = 'anger_count',
  stressCount = 'stress_count',
  socialCount = 'social_count',
}

export class SentimentTable extends Table {
  async create(): Promise<TableNames> {
    const q = `
    CREATE TABLE IF NOT EXISTS ${this.name} (
        message_id INTEGER PRIMARY KEY,
        human_readable_date TEXT NOT NULL,
        happy_count INTEGER NOT NULL,
        love_count INTEGER NOT NULL,
        anger_count INTEGER NOT NULL,
        stress_count INTEGER NOT NULL,
        social_count INTEGER NOT NULL
    )
    `;

    await sqlite3Wrapper.runP(this.db, q);
    log.info(`INFO: created ${this.name}`);
    return this.name;
  }

  async initializeData() {
    const getDataQ = `

    `
  }
}
