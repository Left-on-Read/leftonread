import * as fs from 'fs';
import copy from 'recursive-copy';
import log from 'electron-log';
import * as sqlite3 from 'sqlite3';
import {
  chatPaths,
  addressBookPaths,
  appDirectoryPath,
} from './constants/directories';
import { createAllTables, dropAllTables } from '../../chatBro';

export function initializeDB(path: string): sqlite3.Database {
  const sqldb = sqlite3.verbose();
  const db = new sqldb.Database(path);
  return db;
}

export async function createAppDirectory() {
  if (!fs.existsSync(appDirectoryPath)) {
    fs.mkdirSync(appDirectoryPath);
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
  await copyFiles(chatPaths.original, chatPaths.app);
  await copyFiles(addressBookPaths.original, addressBookPaths.app);
  // const addressBookDBPath = findAddressBookDBPath(addressBookPaths.app);
  const lorDB = initializeDB(chatPaths.app);
  await dropAllTables(lorDB);
  // await addContactColumn(lorDB);
  await createAllTables(lorDB); // TODO: all queries to use a coalesce
  return lorDB;
}
