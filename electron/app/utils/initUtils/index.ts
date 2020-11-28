import * as fs from 'fs';
import copy from 'recursive-copy';
import log from 'electron-log';
import * as sqlite3 from 'sqlite3';
import { initializeDB } from '../../chatBro/db';
import {
  chatPaths,
  addressBookPaths,
  appDirectoryPath,
} from './constants/directories';
import { findPossibleAddressBookDB } from './addressBook/index';
import { createAllTables, dropAllTables } from '../../chatBro';

export async function createAppDirectory() {
  try {
    if (!fs.existsSync(appDirectoryPath)) {
      fs.mkdirSync(appDirectoryPath);
      log.info('createAppDirectory success');
    }
  } catch (e) {
    log.error(`createAppDirectory error ${e}`);
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
  // TODO: logic could be added here depending on what user wants, i.e.,
  //  if user wants to update chat.db, we could recopy, recreate, drop
  //  if user doesn't want to update chat.db, then just initialize and move on
  await createAppDirectory();

  await copyFiles(chatPaths.original, chatPaths.app);
  await copyFiles(addressBookPaths.original, addressBookPaths.app);
  const possibleAddressBookDB = await findPossibleAddressBookDB();
  const lorDB = initializeDB(chatPaths.app);
  await dropAllTables(lorDB);
  if (possibleAddressBookDB) {
    // await addContactColumn(lorDB);
    log.info(`Contacts found: ${possibleAddressBookDB}`);
  } else {
    log.info('No contacts found.');
  }
  await createAllTables(lorDB); // TODO: all queries to use a coalesce
  return lorDB;
}
