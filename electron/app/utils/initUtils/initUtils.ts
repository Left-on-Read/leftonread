import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import copy from 'recursive-copy';
import log from 'electron-log';
import {
  appDirectoryPath,
  appChatDBDirectoryPath,
  originalChatDBDirectoryPath,
} from './constants/directories';

function initializeDB() {
  const sqldb = sqlite3.verbose();
  try {
    const db = new sqldb.Database(`${appChatDBDirectoryPath}`);
    return db;
  } catch (e) {
    log.error(`initializeDB failure: ${e}`);
    throw Error;
  }
}

function createAppDirectory() {
  if (!fs.existsSync(appDirectoryPath)) {
    fs.mkdirSync(appDirectoryPath);
    log.info('createAppDirectory success');
  }
}

export default async function init(): Promise<sqlite3.Database> {
  createAppDirectory();
  try {
    await copy(`${originalChatDBDirectoryPath}`, `${appChatDBDirectoryPath}`, {
      overwrite: true,
    });
  } catch (e) {
    log.error(`copy failure: ${e}`);
  }
  return initializeDB();
}
