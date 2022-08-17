import * as sqlite3 from 'sqlite3';

// Why the heck are these enums instead of constants?
export enum ChatTableNames {
  COUNT_TABLE = 'count_table',
}

export enum CoreTableNames {
  CORE_MAIN_TABLE = 'core_main_table',
}

export enum AddressBookTableNames {
  CONTACT_TABLE = 'contact_table',
}

export enum CalendarTableNames {
  CALENDAR_TABLE = 'calendar_table',
}

export enum SentimentTableNames {
  SENTIMENT_TABLE = 'sentiment_table',
}

export type TableNames =
  | ChatTableNames
  | AddressBookTableNames
  | CoreTableNames
  | CalendarTableNames
  | SentimentTableNames;

export class Table {
  name: TableNames;

  db: sqlite3.Database;

  constructor(db: sqlite3.Database, name: TableNames) {
    this.name = name;
    this.db = db;
  }

  async create(): Promise<TableNames> {
    return this.name;
  }
}
