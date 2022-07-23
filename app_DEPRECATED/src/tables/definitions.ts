export enum ChatTableNames {
  COUNT_TABLE = 'count_table',
}

export enum CoreTableNames {
  CORE_MAIN_TABLE = 'core_main_table',
}

export enum AddressBookTableNames {
  CONTACT_TABLE = 'contact_table',
}

export type TableNames =
  | ChatTableNames
  | AddressBookTableNames
  | CoreTableNames;
