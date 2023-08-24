import axios from 'axios';
import { ipcMain } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import FormData from 'form-data';
import * as fs from 'fs';
import { access } from 'fs/promises';
import { machineId } from 'node-machine-id';
import * as sqlite3 from 'sqlite3';

import { appDirectoryPath, chatPaths } from '../analysis/directories';
import {
  clearExistingDirectory,
  initializeCoreDb,
} from '../analysis/initializeCoreDb';
import { queryAverageDelay } from '../analysis/queries/AverageDelayQuery';
import { queryContactOptions } from '../analysis/queries/ContactOptionsQuery';
import { queryEarliestAndLatestDates } from '../analysis/queries/EarliestAndLatestDatesQuery';
import {
  queryAverageDelayV2,
  queryAverageMessageLength,
  queryDoubleTexts,
  queryLeftOnRead,
} from '../analysis/queries/EngagementQueries';
import { SharedGroupChatTabQueryFilters } from '../analysis/queries/filters/sharedGroupChatTabFilters';
import { SharedQueryFilters } from '../analysis/queries/filters/sharedQueryFilters';
import { queryFriendsOverTimeQuery } from '../analysis/queries/FriendsOverTimeQuery';
import { queryGroupChatActivityOverTime } from '../analysis/queries/GroupChats/GroupChatActivityOverTimeQuery';
import { queryGroupChatByFriends } from '../analysis/queries/GroupChats/GroupChatByFriendsQuery';
import { queryGroupChatReactionsQuery } from '../analysis/queries/GroupChats/GroupChatReactionsQuery';
import {
  queryGetInboxChatIds,
  queryInboxRead,
} from '../analysis/queries/InboxReadQuery';
import { queryInboxWrite } from '../analysis/queries/InboxWriteQuery';
import { queryRespondReminders } from '../analysis/queries/RespondReminders';
import {
  querySentimentOverTimeReceived,
  querySentimentOverTimeSent,
} from '../analysis/queries/SentimentOverTimeQuery';
import {
  queryTextsOverTimeReceived,
  queryTextsOverTimeSent,
} from '../analysis/queries/TextsOverTimeQuery';
import {
  queryTimeOfDayReceived,
  queryTimeOfDaySent,
} from '../analysis/queries/TimeOfDayQuery';
import { queryTopFriends } from '../analysis/queries/TopFriendsQuery';
import { queryTopSentimentFriends } from '../analysis/queries/TopSentimentFriendsQuery';
import { queryTotalSentiment } from '../analysis/queries/TotalSentimentQuery';
import { queryTotalSentVsReceived } from '../analysis/queries/TotalSentVsReceivedQuery';
import {
  IWordOrEmojiFilters,
  queryEmojiOrWordCounts,
} from '../analysis/queries/WordOrEmojiQuery';
import { queryFunniestMessage } from '../analysis/queries/WrappedQueries/FunniestMessageQuery';
import { queryMostPopularDay } from '../analysis/queries/WrappedQueries/MostPopularDayQuery';
import {
  queryTopFriendCountAndWordSimple,
  queryTopFriendsSimple,
} from '../analysis/queries/WrappedQueries/TopFriendsSimpleQuery';
import { API_BASE_URL } from '../constants/api';
import { NotificationSettings } from '../constants/types';
import { APP_VERSION } from '../constants/versions';
import { logEventMain } from '../utils/amplitudeClient';
import {
  activateLicense,
  addCompletedOnboarding,
  checkRequiresRefresh,
  deactivateLicense,
  getCompletedOnboardings,
  getLastRefreshTimestamp,
  getNotificationSettings,
  getShowShareTooltip,
  setLastUpdatedVersion,
  setNotificationSettings,
  setShowShareTooltip,
} from '../utils/store';

function getDb() {
  const sqldb = sqlite3.verbose();
  const db = new sqldb.Database(chatPaths.app);
  return db;
}

export function attachIpcListeners() {
  ipcMain.handle('initialize-tables', async (event, isRefresh) => {
    setLastUpdatedVersion(APP_VERSION);
    await initializeCoreDb({ isRefresh });

    return true;
  });

  ipcMain.handle('store-get-show-share-tooltip', async () => {
    return getShowShareTooltip();
  });

  ipcMain.handle('store-set-show-share-tooltip', async (event, val) => {
    setShowShareTooltip(val);
  });

  ipcMain.handle(
    'query-top-friend-count-and-word-simple',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return queryTopFriendCountAndWordSimple(db, filters);
    }
  );

  ipcMain.handle(
    'query-top-friends',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return queryTopFriends(db, filters);
    }
  );

  ipcMain.handle(
    'query-top-sentiment-friends',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return queryTopSentimentFriends(db, filters);
    }
  );

  ipcMain.handle(
    'query-word-emoji',
    async (event, filters: IWordOrEmojiFilters) => {
      const db = getDb();
      return queryEmojiOrWordCounts(db, filters);
    }
  );

  ipcMain.handle(
    'query-funniest-message-group-chat',
    async (event, filters: SharedGroupChatTabQueryFilters | undefined) => {
      const db = getDb();
      return queryFunniestMessage(db, filters);
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

  ipcMain.handle(
    'query-sentiment-over-time-sent',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return querySentimentOverTimeSent(db, filters);
    }
  );

  ipcMain.handle(
    'query-sentiment-over-time-received',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return querySentimentOverTimeReceived(db, filters);
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
    'query-average-delay',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return queryAverageDelay(db, filters);
    }
  );

  ipcMain.handle(
    'query-average-delay-v2',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return queryAverageDelayV2(db, filters);
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
    'query-avg-length',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return queryAverageMessageLength(db, filters);
    }
  );

  ipcMain.handle(
    'query-double-texts',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return queryDoubleTexts(db, filters);
    }
  );

  ipcMain.handle(
    'query-left-on-read',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return queryLeftOnRead(db, filters);
    }
  );

  ipcMain.handle(
    'query-time-of-day-received',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return queryTimeOfDayReceived(db, filters);
    }
  );

  ipcMain.handle('query-respond-reminders', async () => {
    const db = getDb();
    return queryRespondReminders(db);
  });

  ipcMain.handle('check-permissions', async () => {
    log.info('Inside check persmissions, about to run promise');

    try {
      await Promise.all([
        access(chatPaths.original, fs.constants.R_OK),
        access(`${process.env.HOME}`, fs.constants.W_OK),
      ]);
      log.info('Passed permissions check');
      return true;
    } catch (e: unknown) {
      log.info(`Failed permissions check: ${e}`);
      return false;
    }
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
      logEventMain({ eventName, properties });
    }
  );

  ipcMain.handle('check-requires-refresh', async () => {
    return checkRequiresRefresh();
  });

  ipcMain.handle(
    'query-most-popular-day',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return queryMostPopularDay(db, filters);
    }
  );

  ipcMain.handle(
    'query-top-friends-simple',
    async (event, filters: SharedQueryFilters) => {
      const db = getDb();
      return queryTopFriendsSimple(db, filters);
    }
  );

  ipcMain.handle(
    'query-group-chat-by-friends',
    async (
      event,
      filters: SharedGroupChatTabQueryFilters,
      mode: 'COUNT' | 'DATE',
      limit?: number
    ) => {
      const db = getDb();
      return queryGroupChatByFriends(db, filters, mode, limit);
    }
  );

  ipcMain.handle(
    'query-group-chat-reactions',
    async (event, filters: SharedGroupChatTabQueryFilters) => {
      const db = getDb();
      return queryGroupChatReactionsQuery(db, filters);
    }
  );

  ipcMain.handle('activate-license', async (event, licenseKey: string) => {
    const registrationId = await machineId(false);
    try {
      await axios.post(`${API_BASE_URL}/activate`, {
        licenseKey,
        registrationId,
      });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message;

      return {
        activated: false,
        message: errorMessage || 'Something went wrong...',
      };
    }

    activateLicense(licenseKey);

    return {
      activated: true,
      message: 'Successfully activated!',
    };
  });

  ipcMain.handle('deactivate-license', async () => {
    deactivateLicense();
  });

  ipcMain.handle(
    'query-group-activity-over-time',
    async (event, filters: SharedGroupChatTabQueryFilters) => {
      const db = getDb();
      return queryGroupChatActivityOverTime(db, filters);
    }
  );

  ipcMain.handle('get-notification-settings', async () => {
    return getNotificationSettings();
  });

  ipcMain.handle(
    'set-notification-settings',
    async (event, newSettings: NotificationSettings) => {
      return setNotificationSettings(newSettings);
    }
  );

  ipcMain.handle('get-completed-onboardings', () => {
    return getCompletedOnboardings();
  });

  ipcMain.handle('add-completed-onboarding', (event, cob: string) => {
    addCompletedOnboarding(cob);
  });

  ipcMain.handle('quit-and-install', () => {
    log.info('Quitting and installing...');
    autoUpdater.quitAndInstall();
  });

  // DO NOT USE IN PRODUCTION
  ipcMain.handle('dev-activate-license', async () => {
    if (process.env.NODE_ENV !== 'production') {
      activateLicense('123');
    }
  });

  ipcMain.handle('query-inbox-read', async (event, chatId: string) => {
    const db = getDb();
    return queryInboxRead(db, chatId);
  });

  ipcMain.handle('query-inbox-chat-ids', async (event) => {
    const db = getDb();
    const lastRefreshTimestamp = getLastRefreshTimestamp();
    const chatIds = await queryGetInboxChatIds(db, lastRefreshTimestamp);
    return chatIds;
  });

  ipcMain.handle('query-inbox-write', async (event, chatId: string) => {
    const db = getDb();
    await queryInboxWrite(db, chatId);
  });

  ipcMain.handle(
    'query-friends-over-time',
    async (event, contactName: string) => {
      const db = getDb();
      return queryFriendsOverTimeQuery(db, contactName);
    }
  );
}
