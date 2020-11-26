import * as sqlite3 from 'sqlite3';
import { TableNames } from './definitions'

export class Table {
  name: TableNames
  db: sqlite3.Database

  constructor(db: sqlite3.Database, name: TableNames) {
    this.name = name
    this.db = db
  }

  async create (): Promise<TableNames> {
    return this.name
  }
}
