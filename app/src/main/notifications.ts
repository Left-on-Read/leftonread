import { Notification } from 'electron';
import log from 'electron-log';

import { logEventMain } from '../utils/amplitudeClient';
import { typeMessageToPhoneNumber } from '../utils/appleScriptCommands';
import {
  getLastNotificationTimestamp,
  getLastReminderNotificationMessages,
  getNotificationSettings,
  setLastNotificationTimestamp,
  setLastReminderNotificationMessages,
} from '../utils/store';
import { getLiveRespondReminders } from './LiveDb/getRespondReminders';
import { checkIsInitialized } from './util';

const CHECK_NOTIFICATIONS_INTERVAL = 1000 * 60 * 60 * 4; // 4 hours
const RESPOND_REMINDER_DELAY = 1000 * 60 * 60 * 24; // One day

// const CHECK_NOTIFICATIONS_INTERVAL = 1000 * 60; // 1 minute
// const RESPOND_REMINDER_DELAY = 1000 * 60 * 3; // 3 minutes

export class NotificationsManager {
  reminderInterval: NodeJS.Timer | null = null;

  getAssetPath: (...paths: string[]) => string;

  constructor({
    getAssetPath,
  }: {
    getAssetPath: (...paths: string[]) => string;
  }) {
    this.getAssetPath = getAssetPath;
  }

  registerNotifications() {
    this.reminderInterval = setInterval(() => {
      try {
        this.sendReminderNotification();
      } catch (e) {
        log.error(`Error sending notifications: ${e}`);
      }
    }, CHECK_NOTIFICATIONS_INTERVAL);

    log.info('Registered notifications.');
  }

  unregisterNotifications() {
    if (this.reminderInterval) {
      clearInterval(this.reminderInterval);
    }
    log.info('Unregistered notifications.');
  }

  async sendReminderNotification() {
    if (!checkIsInitialized()) {
      return;
    }

    if (!getNotificationSettings().responseRemindersEnabled) {
      return;
    }

    const lastSentTimestamp = getLastNotificationTimestamp();

    if (!lastSentTimestamp) {
      setLastNotificationTimestamp(new Date());
      return;
    }

    if (
      new Date().getTime() - new Date(lastSentTimestamp).getTime() >
      RESPOND_REMINDER_DELAY
    ) {
      log.info('Sending reminder notification...');

      const reminders = await getLiveRespondReminders();
      if (reminders.length === 0) {
        return;
      }

      const lastSentReminders = getLastReminderNotificationMessages();

      let i = 0;
      for (i = 0; i < reminders.length; i += 1) {
        if (!lastSentReminders.includes(reminders[i].message)) {
          break;
        }
      }

      if (i >= reminders.length) {
        return;
      }

      const reminderToSend = reminders[i];

      const newHistory = [reminderToSend.message, ...lastSentReminders].slice(
        0,
        5
      );

      setLastReminderNotificationMessages(newHistory);

      const reminderNotif = new Notification({
        title: `Forget to respond to ${reminderToSend.friend}?`,
        body: `They sent "${reminderToSend.message}"`,
        timeoutType: 'never',
        closeButtonText: 'Dismiss',
        actions: [
          {
            type: 'button',
            text: 'Respond',
          },
        ],
      });

      reminderNotif.on('click', () => {
        logEventMain({
          eventName: 'RESPOND_TO_REMINDER_NOTIFICATION',
          properties: { method: 'CLICK' },
        });
        typeMessageToPhoneNumber({
          message: '',
          phoneNumber: reminderToSend.friend,
        });
      });

      reminderNotif.on('action', () => {
        logEventMain({
          eventName: 'RESPOND_TO_REMINDER_NOTIFICATION',
          properties: { method: 'ACTION' },
        });

        typeMessageToPhoneNumber({
          message: '',
          phoneNumber: reminderToSend.friend,
        });
      });

      reminderNotif.on('close', () => {
        logEventMain({
          eventName: 'RESPOND_TO_REMINDER_NOTIFICATION_CLOSE',
        });
      });

      reminderNotif.show();
      setLastNotificationTimestamp(new Date());
    }
  }
}
