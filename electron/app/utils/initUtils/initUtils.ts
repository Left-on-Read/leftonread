import * as fs from 'fs';
import copy from 'recursive-copy';
import log from 'electron-log';
import {
  appDirectoryPath,
  appChatDBDirectoryPath,
  originalChatDBDirectoryPath,
} from './constants/directories';

function createAppDirectory() {
  if (!fs.existsSync(appDirectoryPath)) {
    fs.mkdirSync(appDirectoryPath);
    log.info('createAppDirectory success');
  }
}

export async function initChatFiles(): Promise<void> {
  createAppDirectory();
  try {
    await copy(`${originalChatDBDirectoryPath}`, `${appChatDBDirectoryPath}`, {
      overwrite: true,
    });
  } catch (e) {
    log.error(`copy failure: ${e}`);
  }
}
