import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../../utils/sqliteWrapper';
import {
  getAllFilters,
  SharedQueryFilters,
} from '../filters/sharedQueryFilters';

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
