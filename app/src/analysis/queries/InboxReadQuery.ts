import log from 'electron-log';
import * as sqlite3 from 'sqlite3';

import { allP } from '../../utils/sqliteWrapper';
import { CoreTableNames } from '../tables/types';

export enum InboxConversationStatuses {
  'AWAITING_ACTION' = 'AWAITING_ACTION',
  'REMIND_ME' = 'REMIND_ME',
  'REPLY_NOW' = 'REPLY_NOW',
  'DONE' = 'DONE',
}

export type InboxReadQueryResult = {
  message_id: number;
  message: string;
  is_from_me: number;
  human_readable_date: string;
  contact_name: string;
  cache_roomnames: string;
  phone_number: string;
  chat_id: string;
};

export async function queryInboxRead(
  db: sqlite3.Database
): Promise<InboxReadQueryResult[]> {
  // TODO:
  // read off messages directly, to get photos
  // dont bother with reactions right now

  const q = `
        SELECT DISTINCT
            message_id,
            text AS message,
            is_from_me,
            human_readable_date,
            COALESCE(COALESCE(contact_name, id), "UNKNOWN") as contact_name,
            cache_roomnames,
            id AS phone_number,
            chat_id
        FROM ${CoreTableNames.CORE_MAIN_TABLE}
        WHERE message_id IS NOT NULL AND chat_id IS NOT NULL
        AND (service_center != chat_id OR service_center is NULL)
        -- do not do group chats for now
        AND cache_roomnames IS NULL
        -- sort by chat and by date
        ORDER BY human_readable_date ASC
    `;

  return allP(db, q);
}
