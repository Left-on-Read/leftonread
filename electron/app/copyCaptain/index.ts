import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import copy from 'recursive-copy';
import log from 'electron-log';
import { Directories } from './definitions';

// TODO: possibly rethink if this needs to be a class
// Original idea is that this would take a db path as a instance variable
// Would also take things like if { overwrite: true } should be used
export class CopyCaptain {
  constructor() {
  }

  public async init() {
    this.createAppDirectory();
    try {
        await copy(
        `${Directories.originalChatDBDirectoryPath}`,
        `${Directories.appChatDBDirectoryPath}`,
        { overwrite: true },
      );
    } catch(e) {
        log.error(`copy failure: ${e}`);
    }
    return this.initializeDB();
  }

  private createAppDirectory() {
    if (!fs.existsSync(Directories.appDirectoryPath)){
      fs.mkdirSync(Directories.appDirectoryPath);
      log.info('createAppDirectory success');
    }
  }

  private initializeDB() {
    const sqldb = sqlite3.verbose();
    try {
      const db = new sqldb.Database(`${Directories.appChatDBDirectoryPath}`);
      return db;
    }
    catch(e) {
      log.error(`initializeDB failure: ${e}`);
      throw Error;
    }
  }

  // TODO: this needs to be called on app close
  public closeDB(db: sqlite3.Database) {
    db.close();
  }
}
