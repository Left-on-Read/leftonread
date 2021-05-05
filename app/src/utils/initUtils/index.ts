import log from 'electron-log';
import * as fs from 'fs';
import copy from 'recursive-copy';
import * as sqlite3 from 'sqlite3';

import {
  addContactNameColumn,
  findPossibleAddressBookDB,
  setContactNameColumn,
} from '../../addressBro/util/index';
import { closeDB, initializeDB } from '../../db';
import {
  createAllChatTables,
  createContactTable,
  createCoreMainTables,
  dropAllChatTables,
} from '../../tables';
import {
  addressBookDBAliasName,
  appDirectoryInitPath,
  appDirectoryPath,
  chatPaths,
  dirPairings,
} from './constants/directories';
import * as sqlite3Wrapper from './sqliteWrapper';

export async function createAppDirectory() {
  try {
    if (!fs.existsSync(appDirectoryPath)) {
      fs.mkdirSync(appDirectoryPath);
      fs.mkdirSync(appDirectoryInitPath);
      log.info('INFO: createAppDirectory success');
    }
  } catch (e) {
    log.error(`ERROR: ${e}`);
  }
}

// NOTE: this is a very dangerous function
// It overwrites files.
export async function copyFiles(
  originalPath: string,
  appPath: string
): Promise<void> {
  try {
    await copy(`${originalPath}`, `${appPath}`, {
      overwrite: true,
    });
    log.info(`INFO: copyFiles success to ${appPath}`);
  } catch (e) {
    log.error('ERROR: copyFiles error', e);
  }
}

// TODO: logic could be added here depending on what user wants to update their chat.db
export async function coreInit(): Promise<sqlite3.Database> {
  await createAppDirectory();
  if (process.env.DEBUG_ENV) {
    await Promise.all(
      dirPairings.map(async (obj) => copyFiles(obj.debug, obj.app))
    );
  } else {
    await Promise.all(
      dirPairings.map(async (obj) => copyFiles(obj.original, obj.app))
    );
  }
  const possibleAddressBookDB = await findPossibleAddressBookDB();
  const lorDB = initializeDB(chatPaths.app);
  await dropAllChatTables(lorDB);
  if (possibleAddressBookDB) {
    log.info(`INFO: contacts found ${possibleAddressBookDB}`);
    await createContactTable(possibleAddressBookDB);
    try {
      // Typescript thinks db.filename does not exist, but it does.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const q = `ATTACH '${possibleAddressBookDB.filename}' AS ${addressBookDBAliasName}`;
      await sqlite3Wrapper.runP(lorDB, q);
      log.info(`INFO: ATTACH success`, q);
    } catch (err) {
      log.error('ERROR: ATTACH ERROR', err);
    }
    try {
      await addContactNameColumn(lorDB);
      log.info(`INFO: ContactName column added successully`);
    } catch (err) {
      log.warn('WARN: add ContactName column already exists', err);
    }
    try {
      await setContactNameColumn(lorDB);
      log.info(`INFO: ContactName Column set successully`);
    } catch (err) {
      log.error('ERROR: setContactNameColumn error', err);
    }
    closeDB(possibleAddressBookDB); // after setContactNameColumn, we have no use for this db
  } else {
    log.info('INFO: No contacts found.');
  }
  await createCoreMainTables(lorDB);
  /*
   * NOTE:
   *  Whether or not the addressBook was found, we
   *  can use a COALESCE(contact_name, handle.id)
   *  to return the name or the phone
   */
  await createAllChatTables(lorDB);
  return lorDB;
}
