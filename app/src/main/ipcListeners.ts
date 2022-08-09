import axios from 'axios';
import { ipcMain } from 'electron';
import log from 'electron-log';
import FormData from 'form-data';
import * as fs from 'fs';
import * as sqlite3 from 'sqlite3';

import { appDirectoryPath, chatPaths } from '../analysis/directories';
import { initializeCoreDb } from '../analysis/initializeCoreDb';
import { queryContactOptions } from '../analysis/queries/ContactOptionsQuery';
import { queryEarliestAndLatestDates } from '../analysis/queries/EarliestAndLatestDatesQuery';
import {
  ITopFriendsFilters,
  queryTopFriends,
} from '../analysis/queries/TopFriendsQuery';
import {
  queryTotalSentVsReceived,
  TotalSentVsReceivedFilters,
} from '../analysis/queries/TotalSentVsReceivedQuery';
import {
  IWordOrEmojiFilters,
  queryEmojiOrWordCounts,
} from '../analysis/queries/WordOrEmojiQuery';
import { API_BASE_URL } from '../constants/api';

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
    return queryContactOptions(db);
  });

  ipcMain.handle(
    'query-total-sent-vs-received',
    async (event, filters: TotalSentVsReceivedFilters) => {
      const db = getDb();
      return queryTotalSentVsReceived(db, filters);
    }
  );

  ipcMain.handle('query-earliest-and-latest-dates', async (event) => {
    const db = getDb();
    return queryEarliestAndLatestDates(db);
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

  ipcMain.handle(
    'get-logs',
    async (event, email: string, reason: string, content: string) => {
      const formData = new FormData();

      const logFile = await fs.readFileSync(log.transports.file.getFile().path);
      formData.append('logFile', logFile, { filename: 'log.txt' });
      formData.append('email', email);
      formData.append('reason', reason);
      formData.append('content', content);

      await axios.post(`${API_BASE_URL}/help`, formData, {
        headers: formData.getHeaders(),
      });
    }
  );

  ipcMain.handle('check-initialized', async () => {
    return !!fs.existsSync(appDirectoryPath);
  });
}
