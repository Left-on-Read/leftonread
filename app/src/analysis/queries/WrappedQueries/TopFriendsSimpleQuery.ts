import log from 'electron-log';
import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../../utils/sqliteWrapper';
import {
  getAllFilters,
  SharedQueryFilters,
} from '../filters/sharedQueryFilters';
import { wordFluffFilter } from '../WordOrEmojiQuery';

export type TopFriendsSimpleResult = {
  friend: string;
  count: number;
}[];

export async function queryTopFriendsSimple(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<TopFriendsSimpleResult> {
  const allFilters = getAllFilters(
    filters,
    'coalesced_contact_name IS NOT NULL',
    'contact_name'
  );

  const q = `SELECT COUNT(*)  as count, coalesced_contact_name as friend FROM core_main_table ${allFilters} GROUP BY coalesced_contact_name ORDER BY count  DESC LIMIT 10`;
  return sqlite3Wrapper.allP(db, q);
}

export type TopFriendCountAndWordSimpleResult = {
  friend: string;
  sentTotal: number;
  receivedTotal: number;
  word: string;
};

export async function queryTopFriendCountAndWordSimple(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<TopFriendCountAndWordSimpleResult> {
  const allFilters = getAllFilters(
    filters,
    'coalesced_contact_name IS NOT NULL',
    'contact_name'
  );

  const q = `SELECT COUNT(*)  as count, coalesced_contact_name as friend, is_from_me, chat_id
  FROM core_main_table ${allFilters} GROUP BY coalesced_contact_name, is_from_me ORDER BY count  DESC`;
  const rawTopFriendResult: {
    count: number;
    friend: string;
    is_from_me: number;
  }[] = await sqlite3Wrapper.allP(db, q);

  if (rawTopFriendResult[0]) {
    const topFriend = rawTopFriendResult[0].friend;

    const topFriendResult: {
      count: number;
      friend: string;
      is_from_me: number;
    }[] = rawTopFriendResult.filter((f) => f.friend === topFriend);

    if (topFriendResult.length > 1) {
      const wordQ = `SELECT COUNT(*) as count, word FROM count_table WHERE contact = "${
        topFriendResult[0].friend
      }" AND ${wordFluffFilter()} GROUP BY word ORDER BY count DESC LIMIT 1`;
      const topWord: { word: string }[] = await sqlite3Wrapper.allP(db, wordQ);

      const result = {
        friend: topFriendResult[0].friend,
        sentTotal: topFriendResult.find((f) => f.is_from_me === 1)?.count ?? 0,
        receivedTotal:
          topFriendResult.find((f) => f.is_from_me === 0)?.count ?? 0,
      };

      if (topWord.length > 0) {
        return { ...result, word: topWord[0].word };
      }
      log.error('No word result found queryTopFriendCountSimple');

      return { ...result, word: 'lol' };
    }
    log.error('No results found queryTopFriendCountSimple');
    return {
      friend: 'Steve Jobs',
      sentTotal: 0,
      receivedTotal: 0,
      word: 'lol',
    };
  }

  log.error('No results found queryTopFriendCountSimple');
  return {
    friend: 'Steve Jobs',
    sentTotal: 0,
    receivedTotal: 0,
    word: 'lol',
  };
}
