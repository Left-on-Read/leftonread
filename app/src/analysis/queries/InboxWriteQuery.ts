import log from 'electron-log';
import * as sqlite3 from 'sqlite3';

import { runP } from '../../utils/sqliteWrapper';
import { CoreTableNames } from '../tables/types';

export async function queryInboxWrite(
  db: sqlite3.Database,
  chatId: string
): Promise<void> {
  // For now, just use the service_center column which is unused. In the future, we'll use a different column
  // Also, we should update every single row. The update is chat based, but right now table is message based
  const q = `
        UPDATE ${CoreTableNames.CORE_MAIN_TABLE} SET service_center = ${chatId} WHERE chat_id = ${chatId}
    `;

  return runP(db, q);
}
