import log from 'electron-log';
import Sentiment from 'sentiment';

import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { getAllMessages } from '../queries/RawMessageQuery';
import { Table, TableNames } from './types';

export enum SentimentTableColumns {
  SCORE = 'score',
  COMPARATIVE = 'comparative',
}

const nullOrText = (value: string | null) => {
  if (value === 'null' || value === null || value === 'NULL') {
    return 'NULL';
  }

  return `"${value}"`;
};

export class SentimentTable extends Table {
  async create(): Promise<TableNames> {
    const createQ = `
    CREATE TABLE IF NOT EXISTS ${this.name} (
        message_id INTEGER NOT NULL,
        human_readable_date TEXT NOT NULL,
        is_from_me INTEGER NOT NULL,
        contact_name TEXT,
        cache_roomnames TEXT,
        phone_number TEXT NOT NULL,
        ${SentimentTableColumns.SCORE} INTEGER NOT NULL,
        ${SentimentTableColumns.COMPARATIVE} REAL NOT NULL
    )
    `;

    await sqlite3Wrapper.runP(this.db, createQ);
    log.info(`INFO: created ${this.name}`);

    const allMessages = await getAllMessages(this.db);

    const rowsToInsert: string[] = [];
    const sentiment = new Sentiment();
    for (let i = 0; i < allMessages.length; i += 1) {
      const currentMessage = allMessages[i];
      const result = sentiment.analyze(currentMessage.message);

      rowsToInsert.push(
        `(${currentMessage.message_id},${currentMessage.is_from_me},"${
          currentMessage.human_readable_date
        }",${nullOrText(currentMessage.contact_name)},${nullOrText(
          currentMessage.cache_roomnames
        )},"${currentMessage.phone_number}",${result.score},${
          result.comparative
        })`
      );
    }

    const insertQ = `
      INSERT INTO ${
        this.name
      } (message_id, is_from_me, human_readable_date, contact_name, cache_roomnames, phone_number, ${
      SentimentTableColumns.SCORE
    }, ${SentimentTableColumns.COMPARATIVE})
      VALUES
        ${rowsToInsert.join(',\n')}
    `;

    await sqlite3Wrapper.runP(this.db, insertQ);

    log.info(`INFO: populated ${this.name}`);

    return this.name;
  }
}
