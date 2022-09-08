import { ipcMain, Notification, powerSaveBlocker } from 'electron';
import log from 'electron-log';
import schedule from 'node-schedule';

import { ScheduledMessage } from '../constants/types';
import { typeAndSendMessageToPhoneNumber } from '../utils/appleScriptCommands';
import {
  addScheduledMessage,
  clearScheduledMessage,
  getScheduledMessages,
} from '../utils/store';

export class MessageScheduler {
  private jobTracker = new Map<string, schedule.Job>();

  registerScheduledMessages() {
    log.info('Register all messages.');

    powerSaveBlocker.start('prevent-app-suspension');
    // First, unschedule any existing ones to avoid duplicates
    schedule.gracefulShutdown();

    const currentMessages = getScheduledMessages();
    currentMessages.forEach((msg) => {
      this.scheduleMessage(msg);
    });
  }

  private scheduleMessage(message: ScheduledMessage) {
    log.info('Scheduling message...');
    const job = schedule.scheduleJob(new Date(message.sendDate), () => {
      this.sendMessage(message);
    });

    this.jobTracker.set(message.id, job);
  }

  sendMessage(message: ScheduledMessage) {
    try {
      log.info('Scheduled message successfully sent!');
      typeAndSendMessageToPhoneNumber({
        phoneNumber: message.phoneNumber,
        message: message.message,
      });
      new Notification({
        title: 'Scheduled Message Sent',
        body: `Your scheduled message to ${message.contactName} sent successfully.`,
      }).show();
      this.deleteScheduledMessage(message.id);
    } catch (e) {
      log.error(`Scheduled message failed with: ${e}`);
      new Notification({
        title: 'Scheduled Message Failed',
        body: `Your scheduled message to ${message.contactName} failed to send.`,
      }).show();
    }
  }

  createNewScheduledMessage(message: ScheduledMessage) {
    addScheduledMessage(message);
    this.scheduleMessage(message);
  }

  deleteScheduledMessage(messageId: string) {
    const job = this.jobTracker.get(messageId);
    if (job) {
      job.cancel();
      this.jobTracker.delete(messageId);
    }
    clearScheduledMessage(messageId);
  }
}

export function initMessageScheduler() {
  const messageScheduler = new MessageScheduler();

  messageScheduler.registerScheduledMessages();

  ipcMain.handle(
    'add-scheduled-message',
    (event, newScheduledMessage: ScheduledMessage) => {
      messageScheduler.createNewScheduledMessage(newScheduledMessage);
    }
  );

  ipcMain.handle('delete-scheduled-message', (event, messageId: string) => {
    messageScheduler.deleteScheduledMessage(messageId);
  });

  ipcMain.handle('get-scheduled-messages', () => {
    return getScheduledMessages();
  });

  ipcMain.handle('send-message', async (event, message: ScheduledMessage) => {
    await messageScheduler.sendMessage(message);
  });
}
