import log from 'electron-log';
import Store from 'electron-store';
import semver from 'semver';
import { v4 as uuidv4 } from 'uuid';

import { NotificationSettings, ScheduledMessage } from '../constants/types';

// requiredUpdateVersion is a version that requires a data refresh
const migrations = {
  '0.1.1': (store: any) => store.set('requiredUpdateVersion', '0.1.1'),
  '>=0.2.2': (store: any) => store.set('license', ''),
  '>=1.0.0': (store: any) => {
    store.set('notificationSettings', {
      responseRemindersEnabled: true,
    });
  },
  '1.2.3': (store: any) => store.set('requiredUpdateVersion', '1.2.3'),
  '2.1.2': (store: any) => store.set('requiredUpdateVersion', '2.1.2'),
  '4.0.0': (store: any) => store.set('requiredUpdateVersion', '4.0.0'),
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
  scheduledMessages: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        message: { type: 'string' },
        phoneNumber: { type: 'string' },
        contactName: { type: 'string' },
        sendDate: { type: 'string' },
      },
    },
    default: [],
  },
  completedOnboardings: {
    type: 'array',
    items: {
      type: 'string',
    },
    default: [],
  },
  lastRefreshTimestamp: {
    type: 'string',
    default: '',
  },
  showShareTooltip: {
    type: 'boolean',
    default: true,
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

export function getLastRefreshTimestamp(): string {
  return store.get('lastRefreshTimestamp', '') as string;
}

export function getShowShareTooltip(): boolean {
  return store.get('showShareTooltip', false) as boolean;
}

export function setShowShareTooltip(val: boolean) {
  store.set('showShareTooltip', val);
}

export function setLastRefreshTimestamp(d: Date) {
  const inLocalTime = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  // HACK: chat.db is ahead by one hour, so we make this match the chat.db time
  inLocalTime.setHours(inLocalTime.getHours() + 1);
  store.set('lastRefreshTimestamp', inLocalTime.toISOString());
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

export function addScheduledMessage(scheduledMessage: ScheduledMessage) {
  const newScheduledMessages = [...(store.get('scheduledMessages') as any[])];

  newScheduledMessages.push({
    ...scheduledMessage,
    sendDate: scheduledMessage.sendDate.toISOString(),
  });

  store.set('scheduledMessages', newScheduledMessages);
}

export function clearScheduledMessage(scheduledMessageId: string) {
  const currentScheduledMessages = [
    ...(store.get('scheduledMessages') as ScheduledMessage[]),
  ];

  const newScheduledMessages = currentScheduledMessages.filter(
    (msg) => msg.id !== scheduledMessageId
  );

  store.set('scheduledMessages', newScheduledMessages);
}

export function getScheduledMessages(): ScheduledMessage[] {
  const messages: ScheduledMessage[] = (
    store.get('scheduledMessages') as any[]
  ).map((msg) => ({ ...msg, sendDate: new Date(msg.sendDate) }));
  return messages;
}

export function getCompletedOnboardings() {
  return store.get('completedOnboardings') as string[];
}

export function addCompletedOnboarding(cob: string) {
  const currentCompletedOnboardings = getCompletedOnboardings();

  const updatedCompletedOnboardings = [cob, ...currentCompletedOnboardings];

  store.set('completedOnboardings', updatedCompletedOnboardings);
}
