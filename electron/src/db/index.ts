import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import * as fs from 'fs';
import * as sqlite3Wrapper from '../utils/initUtils/sqliteWrapper';

export function initializeDB(path: string): sqlite3.Database {
  const sqldb = sqlite3.verbose();
  const db = new sqldb.Database(path);
  return db;
}

export function closeDB(db: sqlite3.Database) {
  log.info('Closing DB');
  db.close();
}

export async function getRecordCounts(
  db: sqlite3.Database,
  checkQuery: string
): Promise<number> {
  const checkResult = await sqlite3Wrapper.allP(db, checkQuery);
  if (checkResult && Number(checkResult[0].count) > 0) {
    log.info(`${checkResult[0].count} records found`);
    return checkResult[0].count;
  }
  log.info(`${db}: No records found`);
  return 0;
}

export interface DBRecordCount {
  db: sqlite3.Database;
  recordCount: number;
}

export async function getDBWithRecordCounts(
  dbPath: string,
  checkQuery: string
): Promise<DBRecordCount | undefined> {
  log.info(`Attempting to initialize ${dbPath}`);
  if (fs.existsSync(dbPath)) {
    const db = initializeDB(dbPath);
    const recordCount = await getRecordCounts(db, checkQuery);
    if (recordCount > 0) {
      log.info(`${dbPath} populated`);
      return { db, recordCount };
    }
    closeDB(db); // we close here because if it's empty it's useless to us
    return { db, recordCount };
  }
  return undefined;
}
