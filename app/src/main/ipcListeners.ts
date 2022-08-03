import { ipcMain } from 'electron';
import * as fs from 'fs';
import * as sqlite3 from 'sqlite3';

import { chatPaths } from '../analysis/directories';
import { initializeCoreDb } from '../analysis/initializeCoreDb';
import { getContactOptions } from '../analysis/queries/getContactOptions';
import {
  ITopFriendsFilters,
  queryTopFriends,
} from '../analysis/queries/TopFriendsQuery';
import {
  IWordOrEmojiFilters,
  queryEmojiOrWordCounts,
} from '../analysis/queries/WordOrEmojiQuery';

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
      return queryTopFriends(db, filters);
    }
  );

  ipcMain.handle(
    'query-word-emoji',
    async (event, filters: IWordOrEmojiFilters) => {
      const db = getDb();
      return queryEmojiOrWordCounts(db, filters);
    }
  );

  ipcMain.handle('query-get-contact-options', async () => {
    const db = getDb();
    return getContactOptions(db);
  });

  ipcMain.handle('check-permissions', async () => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        fs.copyFile(chatPaths.original, chatPaths.init, (err) => {
          if (err) {
            resolve(false);
          }
          resolve(true);
        });
        // NOTE(teddy): Artifically take 1s to give impression of loading
      }, 1000);
    });
  });
}
