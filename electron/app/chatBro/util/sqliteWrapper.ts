/**
 * Promise based wrapper functions for sqlite3
 */
import * as sqlite3 from "sqlite3";

export async function allP(db: sqlite3.Database, query: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.all(query, (err: Error, res: any) => {
      if (err) reject(err);
      resolve(res);
    })
  });
}

export async function runP(db: sqlite3.Database, query: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run(query, (err: Error, res: any) => {
      if (err) reject(err);
      resolve(res);
    })
  });
}

