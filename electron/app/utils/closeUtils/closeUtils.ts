import * as sqlite3 from 'sqlite3';
import log from 'electron-log';

export default function closeDB(db: sqlite3.Database) {
  log.info('Closing DB');
  db.close();
}
