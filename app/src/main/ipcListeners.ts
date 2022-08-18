import axios from 'axios';
import { ipcMain } from 'electron';
import log from 'electron-log';
import FormData from 'form-data';
import * as fs from 'fs';
import * as sqlite3 from 'sqlite3';

import { appDirectoryPath, chatPaths } from '../analysis/directories';
import {
  clearExistingDirectory,
  initializeCoreDb,
} from '../analysis/initializeCoreDb';
import { queryContactOptions } from '../analysis/queries/ContactOptionsQuery';
import { queryEarliestAndLatestDates } from '../analysis/queries/EarliestAndLatestDatesQuery';
import { SharedQueryFilters } from '../analysis/queries/filters/sharedQueryFilters';
import {
  queryTextsOverTimeReceived,
  queryTextsOverTimeSent,
} from '../analysis/queries/TextsOverTimeQuery';
import {
  queryTimeOfDayReceived,
  queryTimeOfDaySent,
} from '../analysis/queries/TimeOfDayQuery';
import { queryTopFriends } from '../analysis/queries/TopFriendsQuery';
import { queryTotalSentiment } from '../analysis/queries/TotalSentimentQuery';
import { queryTotalSentVsReceived } from '../analysis/queries/TotalSentVsReceivedQuery';
import {
  IWordOrEmojiFilters,
  queryEmojiOrWordCounts,
} from '../analysis/queries/WordOrEmojiQuery';
import { API_BASE_URL } from '../constants/api';
import { APP_VERSION } from '../constants/versions';
import { AmplitudeClient } from '../utils/amplitudeClient';
import { getUuid } from '../utils/store';

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
    async (event, filters: SharedQueryFilters) => {
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
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return queryTotalSentVsReceived(db, filters);
    }
  );

  ipcMain.handle(
    'query-total-sentiment',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return queryTotalSentiment(db, filters);
    }
  );

  ipcMain.handle('query-earliest-and-latest-dates', async (event) => {
    const db = getDb();
    return queryEarliestAndLatestDates(db);
  });

  ipcMain.handle(
    'query-text-over-time-received',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return queryTextsOverTimeReceived(db, filters);
    }
  );

  ipcMain.handle(
    'query-text-over-time-sent',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return queryTextsOverTimeSent(db, filters);
    }
  );

  ipcMain.handle(
    'query-time-of-day-sent',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return queryTimeOfDaySent(db, filters);
    }
  );

  ipcMain.handle(
    'query-time-of-day-received',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return queryTimeOfDayReceived(db, filters);
    }
  );

  ipcMain.handle('check-permissions', async () => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        try {
          fs.accessSync(chatPaths.original, fs.constants.R_OK);
          fs.accessSync(`${process.env.HOME}`, fs.constants.W_OK);
          log.info('Passed permissions check');
          resolve(true);
        } catch (e: unknown) {
          log.info(`Failed permissions check: ${e}`);
          resolve(false);
        }

        // NOTE(teddy): Artificially take 1s to give impression of loading
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
      formData.append('content', `${content}\n\nVersion: ${APP_VERSION}`);

      await axios.post(`${API_BASE_URL}/help`, formData, {
        headers: formData.getHeaders(),
      });
    }
  );

  ipcMain.handle('check-initialized', async () => {
    return !!fs.existsSync(appDirectoryPath);
  });

  ipcMain.handle('reset-application-data', async () => {
    await clearExistingDirectory();
  });

  ipcMain.handle(
    'log-event',
    (
      event,
      eventName: string,
      properties: Record<string, string | number> | undefined
    ) => {
      const uuid = getUuid();

      try {
        AmplitudeClient.logEvent(
          {
            user_id: uuid,
            event_type: eventName,
          },
          properties
        );
      } catch (e) {
        log.error(e);
      }
    }
  );
}
