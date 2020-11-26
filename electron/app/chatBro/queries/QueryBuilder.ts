import * as sqlite3 from 'sqlite3';
import { TableNames } from '../tables'

export class QueryBuilder {
  tableName: TableNames
  db: sqlite3.Database

  constructor(db: sqlite3.Database, tableName: TableNames) {
    this.tableName = tableName
    this.db = db
  }
}