import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../utils/sqliteWrapper';

// A test function for me to understand the altered DB schema better :)
export async function printDBTableNames(
  db: sqlite3.Database
): Promise<string[]> {
  const q = `
  SELECT 
    name 
  FROM 
    sqlite_master 
  WHERE 
    type='table' 
  ORDER BY 
    name
  `;
  return sqlite3Wrapper.allP(db, q);
}

interface IRAGEngineResults {
  message_count: string;
}
export type TRAGEngineResults = IRAGEngineResults[];

export async function queryRAGEngine(
  db: sqlite3.Database,
  message: string
): Promise<TRAGEngineResults> {
  const q = `
  SELECT COUNT(*) AS message_count
  FROM core_main_table
  WHERE LOWER(contact_name) = LOWER('${message}');
  `;
  return sqlite3Wrapper.allP(db, q);
}
