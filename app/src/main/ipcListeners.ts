import {
  ITopFriendsFilters,
  queryTopFriends,
} from '../analysis/queries/TopFriendsQuery';
import { ipcMain } from 'electron';
import { initializeCoreDb } from '../analysis/initializeCoreDb';
import * as sqlite3 from 'sqlite3';
import { chatPaths } from '../analysis/directories';

function getDb() {
  const sqldb = sqlite3.verbose();
  const db = new sqldb.Database(chatPaths.app);
  return db;
}

export function attachIpcListeners() {
  ipcMain.handle('initialize-tables', async (event, arg) => {
    await initializeCoreDb();
    return true;
  });

  ipcMain.handle(
    'query-top-friends',
    async (event, filters: ITopFriendsFilters) => {
      const db = getDb();
      return await queryTopFriends(db, filters);
    }
  );
}
