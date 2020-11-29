import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import * as fs from 'fs';
import * as sqlite3Wrapper from '../utils/initUtils/sqliteWrapper';

export function initializeDB(path: string): sqlite3.Database {
  const sqldb = sqlite3.verbose();
  const db = new sqldb.Database(path);
  return db;
}

export default function closeDB(db: sqlite3.Database) {
  log.info('Closing DB');
  db.close();
}

export async function checkIfRecordsExist(
  db: sqlite3.Database,
  checkQuery: string
): Promise<boolean> {
  const checkResult = await sqlite3Wrapper.allP(db, checkQuery);
  if (checkResult && Number(checkResult[0].count) > 0) {
    log.info(`${checkResult[0].count} records found`);
    return true;
  }
  log.info(`${db}: No records found`);
  return false;
}

export async function returnDBIfPopulated(
  dbPath: string,
  checkQuery: string
): Promise<sqlite3.Database | undefined> {
  log.info(`Attempting to initialize ${dbPath}`);
  if (fs.existsSync(dbPath)) {
    const db = initializeDB(dbPath);
    if (await checkIfRecordsExist(db, checkQuery)) {
      log.info(`${db} populated`);
      return db;
    }
    closeDB(db); // we close here because if it's empty it's useless to us
  }
  return undefined;
}
