export enum ChatTableNames {
  WORD_TABLE = 'word_table',
  EMOJI_TABLE = 'emoji_table',
  TOP_FRIENDS_TABLE = 'top_friends_table',
  CORE_COUNT_TABLE = 'core_count_table',
}

export enum AddressBookTableNames {
  CONTACT_TABLE = 'contact_table',
}

export type TableNames = ChatTableNames | AddressBookTableNames;
