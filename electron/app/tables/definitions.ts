export enum ChatTableNames {
  WORD_TABLE = 'word_table',
  TOP_FRIENDS_TABLE = 'top_friends_table',
}

export enum AddressBookTableNames {
  CONTACT_TABLE = 'contact_table',
}

export type TableNames = ChatTableNames | AddressBookTableNames;
