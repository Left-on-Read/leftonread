import * as fs from 'fs';
import copy from 'recursive-copy';
import log from 'electron-log';
import * as sqlite3 from 'sqlite3';
import * as dirs from './constants/directories';
import { createAllTables, dropAllTables } from '../../chatBro';

export function initializeDB(path: string): sqlite3.Database {
  const sqldb = sqlite3.verbose();
  const db = new sqldb.Database(path);
  return db;
}

export async function createAppDirectory() {
  if (!fs.existsSync(dirs.appDirectoryPath)) {
    fs.mkdirSync(dirs.appDirectoryPath);
    log.info('createAppDirectory success');
  }
}

export async function copyFiles(
  originalPath: string,
  appPath: string
): Promise<void> {
  try {
    await copy(`${originalPath}`, `${appPath}`, {
      overwrite: true,
    });
    log.info(`copyFiles success to ${appPath}`);
  } catch (e) {
    log.error(`copyFiles failure: ${e}`);
  }
}

export async function coreInit(): Promise<sqlite3.Database> {
  await createAppDirectory();
  await copyFiles(dirs.originalChatDBPath, dirs.appChatDBPath);
  await copyFiles(
    dirs.originalAddressBookDirectoryPath,
    dirs.appAddressBookDirectoryPath
  );
  // const addressBookDB = findAddressBookDB(
  //   dirs.appAddressBookDirectoryPath
  // );
  const lorDB = initializeDB(dirs.appChatDBPath);
  // join to handle table
  await dropAllTables(lorDB);
  await createAllTables(lorDB);
  return lorDB;
}
