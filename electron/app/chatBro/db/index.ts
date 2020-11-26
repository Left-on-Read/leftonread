import * as _ from 'lodash';
import * as sqlite3 from 'sqlite3';

export function initializeDB(path: string): sqlite3.Database {
  const sqldb = sqlite3.verbose();
  const db = new sqldb.Database(path);
  return db;
}

export function closeDB(db: sqlite3.Database): void {
  db.close();
}
