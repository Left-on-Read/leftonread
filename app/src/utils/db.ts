import log from 'electron-log';
import * as fs from 'fs';
import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from './sqliteWrapper';

export function initializeDB(path: string): sqlite3.Database {
  const sqldb = sqlite3.verbose();
  const db = new sqldb.Database(path);
  return db;
}

export function closeDB(db: sqlite3.Database) {
  log.info('INFO: closing DB');
  db.close();
}

export async function getRecordCounts(
  db: sqlite3.Database,
  checkQuery: string
): Promise<number> {
  const checkResult = await sqlite3Wrapper.allP(db, checkQuery);
  if (checkResult && Number(checkResult[0].count) > 0) {
    log.info(`INFO: ${checkResult[0].count} records found`);
    return checkResult[0].count;
  }
  log.info(`INFO: no records found`);
  return 0;
}

export interface DBWithRecordCount {
  db: sqlite3.Database | null;
  recordCount: number;
}

export async function getDBWithRecordCounts(
  dbPath: string,
  checkQuery: string
) {
  log.info(`INFO: attempting to initialize ${dbPath}`);
  if (fs.existsSync(dbPath)) {
    const db = initializeDB(dbPath);
    const recordCount = await getRecordCounts(db, checkQuery);
    if (recordCount < 1) {
      closeDB(db); // we close here because if it's empty it's useless to us
    }
    return { db, recordCount };
  }
  return { db: null, recordCount: 0 };
}
