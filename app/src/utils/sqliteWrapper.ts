/**
 * Promise based wrapper functions for sqlite3
 */
import log from 'electron-log';
import * as sqlite3 from 'sqlite3';

/**
 * Returns the data you queried for
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function allP(db: sqlite3.Database, query: string): Promise<any> {
  // If verbose:
  // log.info(`Running query and returning: ${query}`);
  return new Promise((resolve, reject) => {
    db.all(query, (err: Error, res: any) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

export async function runP(db: sqlite3.Database, query: string): Promise<any> {
  // If verbose:
  // log.info(`Running query: ${query}`);
  return new Promise((resolve, reject) => {
    db.run(query, (err: Error, res: any) => {
      if (err) {
        log.error(err);
        reject(err);
        return;
      }
      resolve(res);
    });
  });
}
/* eslint-enable  @typescript-eslint/no-explicit-any */
