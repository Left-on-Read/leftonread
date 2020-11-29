// TODO: Refactor this into the top-level utils folder

/**
 * Promise based wrapper functions for sqlite3
 */
import * as sqlite3 from 'sqlite3';

/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function allP(db: sqlite3.Database, query: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.all(query, (err: Error, res: any) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

export async function runP(db: sqlite3.Database, query: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run(query, (err: Error, res: any) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}
/* eslint-enable  @typescript-eslint/no-explicit-any */
