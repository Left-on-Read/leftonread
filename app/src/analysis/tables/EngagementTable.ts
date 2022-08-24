import log from 'electron-log';

import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { getAllMessages } from '../queries/RawMessageQuery';
import { Table, TableNames } from './types';

export enum EngagementTableColumns {
  MESSAGE_ID = 'message_id',
  CHAT_ID = 'chat_id',
  HUMAN_READABLE_DATE = 'human_readable_date',
  CONTACT_NAME = 'contact_name',
  CACHE_ROOMNAMES = 'cache_roomnames',
  MESSAGE = 'message',
  DELAY_IN_SECONDS = 'delay_in_seconds',
  IS_DOUBLE_TEXT = 'is_double_text',
  IS_FROM_ME = 'is_from_me',
}

const nullOrText = (value: string | null) => {
  if (value === 'null' || value === null || value === 'NULL') {
    return 'NULL';
  }

  return `"${value}"`;
};

export class EngagementTable extends Table {
  async create(): Promise<TableNames> {
    const createQ = `
    CREATE TABLE IF NOT EXISTS ${this.name} (
        ${EngagementTableColumns.MESSAGE_ID} INTEGER NOT NULL,
        ${EngagementTableColumns.CHAT_ID} INTEGER NOT NULL,
        ${EngagementTableColumns.HUMAN_READABLE_DATE} TEXT NOT NULL,
        ${EngagementTableColumns.CONTACT_NAME} TEXT,
        ${EngagementTableColumns.CACHE_ROOMNAMES} TEXT,
        ${EngagementTableColumns.MESSAGE} TEXT,
        ${EngagementTableColumns.IS_FROM_ME} INTEGER NOT NULL,
        ${EngagementTableColumns.DELAY_IN_SECONDS} INTEGER,
        ${EngagementTableColumns.IS_DOUBLE_TEXT} INTEGER NOT NULL
    )
    `;

    await sqlite3Wrapper.runP(this.db, createQ);
    log.info(`INFO: created ${this.name}`);

    const allMessages = await getAllMessages(this.db, true);

    const rowsToInsert: string[] = [];

    let lastMessage = null;

    // const seenMessageIds = new Set<number>();

    for (let i = 0; i < allMessages.length; i += 1) {
      const currentMessage = allMessages[i];

      // if (seenMessageIds.has(currentMessage.message_id)) {
      //   log.error(currentMessage.message_id);
      // }
      // seenMessageIds.add(currentMessage.message_id);

      let delayInSeconds = null;
      let isDoubleText = true;

      // Ensure it's in the same conversation
      if (lastMessage && lastMessage.chat_id === currentMessage.chat_id) {
        delayInSeconds =
          (new Date(lastMessage.human_readable_date).getTime() -
            new Date(currentMessage.human_readable_date).getTime()) /
          1000;

        if (lastMessage.is_from_me !== currentMessage.is_from_me) {
          isDoubleText = false;
        }
      }

      const newRow = [
        currentMessage.message_id,
        currentMessage.chat_id,
        `"${currentMessage.human_readable_date}"`,
        nullOrText(currentMessage.contact_name),
        nullOrText(currentMessage.cache_roomnames),
        currentMessage.is_from_me,
        delayInSeconds === null ? 'NULL' : delayInSeconds,
        isDoubleText === true ? 1 : 0,
      ];

      lastMessage = currentMessage;

      rowsToInsert.push(`(${newRow.join(',')})`);
    }

    const INSERT_ROWS = [
      EngagementTableColumns.MESSAGE_ID,
      EngagementTableColumns.CHAT_ID,
      EngagementTableColumns.HUMAN_READABLE_DATE,
      EngagementTableColumns.CONTACT_NAME,
      EngagementTableColumns.CACHE_ROOMNAMES,
      EngagementTableColumns.IS_FROM_ME,
      EngagementTableColumns.DELAY_IN_SECONDS,
      EngagementTableColumns.IS_DOUBLE_TEXT,
    ];

    const insertQ = `
      INSERT INTO ${this.name} (
        ${INSERT_ROWS.join(',')}
      )
      VALUES
        ${rowsToInsert.join(',\n')}
    `;

    await sqlite3Wrapper.runP(this.db, insertQ);

    log.info(`INFO: populated ${this.name}`);

    return this.name;
  }
}
