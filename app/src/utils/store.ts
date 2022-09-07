import log from 'electron-log';
import Store from 'electron-store';
import semver from 'semver';
import { v4 as uuidv4 } from 'uuid';

import { NotificationSettings } from '../constants/types';

const migrations = {
  '0.1.1': (store: any) => store.set('requiredUpdateVersion', '0.1.1'),
  '>=0.2.2': (store: any) => store.set('license', ''),
  '>=1.0.0': (store: any) => {
    store.set('notificationSettings', {
      responseRemindersEnabled: true,
    });
  },
};

const schema = {
  uuid: {
    type: 'string',
    default: uuidv4(),
  },
  lastUpdatedVersion: {
    // When the user last refreshed data
    type: 'string',
    default: '',
  },
  requiredUpdateVersion: {
    // Breaking version for user
    type: 'string',
    default: '0.0.1',
  },
  license: {
    type: 'string',
    default: '',
  },
  lastSentNotificationTimestamp: {
    type: 'string',
    default: '',
  },
  lastReminderNotificationMessages: {
    type: 'array',
    default: [],
    items: {
      type: 'string',
    },
  },
  notificationSettings: {
    type: 'object',
    properties: {
      responseRemindersEnabled: { type: 'boolean', default: true },
    },
    default: {
      responseRemindersEnabled: true,
    },
  },
} as const;

const store = new Store({ schema, migrations });
Store.initRenderer();
log.info(`Store path: ${store.path}`);

export function getUuid(): string {
  return store.get('uuid' as string);
}

export function checkRequiresRefresh(): boolean {
  const lastUpdatedVersion = store.get('lastUpdatedVersion') as string;
  const requiredUpdateVersion = store.get('requiredUpdateVersion') as string;

  if (lastUpdatedVersion === '') {
    return true;
  }

  return semver.gt(requiredUpdateVersion, lastUpdatedVersion);
}

export function setLastUpdatedVersion(version: string) {
  store.set('lastUpdatedVersion', version);
}

export function activateLicense(licenseKey: string) {
  store.set('license', licenseKey);
}

export function deactivateLicense() {
  store.set('license', '');
}

export function setLastNotificationTimestamp(date: Date) {
  store.set('lastSentNotificationTimestamp', date.toISOString());
}

export function getLastNotificationTimestamp() {
  return store.get('lastSentNotificationTimestamp') as string;
}

export function setLastReminderNotificationMessages(messages: string[]) {
  store.set('lastReminderNotificationMessages', messages);
}

export function getLastReminderNotificationMessages() {
  return (store.get('lastReminderNotificationMessages') ?? []) as string[];
}

export function getNotificationSettings() {
  return store.get('notificationSettings') as NotificationSettings;
}

export function updateNotificationSetting(
  setting: keyof NotificationSettings,
  value: boolean
) {
  const currentSettings = { ...getNotificationSettings() };
  currentSettings[setting] = value;
  store.set('notificationSettings', currentSettings);
}

export function setNotificationSettings(newSettings: NotificationSettings) {
  return store.set('notificationSettings', newSettings);
}
