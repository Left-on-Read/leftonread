import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../../utils/sqliteWrapper';
import {
  getAllGroupChatTabFilters,
  SharedGroupChatTabQueryFilters,
} from '../filters/sharedGroupChatTabFilters';

export type GroupChatByFriends = {
  count: number;
  contact_name: string;
  group_chat_name: string;
};

export async function queryGroupChatByFriends(
  db: sqlite3.Database,
  filters: SharedGroupChatTabQueryFilters,
  sortMode: 'COUNT' | 'DATE',
  limit?: number
): Promise<GroupChatByFriends[]> {
  const allFilters = getAllGroupChatTabFilters(filters);
  let limitClause = '';
  if (typeof limit === 'number') {
    limitClause = `LIMIT ${limit}`;
  }

  let sortColumn = 'count';
  if (sortMode === 'DATE') {
    sortColumn = 'human_readable_date';
  }

  // TODO(Danilowicz): we probably want to have a sort by mode
  // either sort by volume or by recency
  const q = `    
    SELECT COUNT(text) as count, contact_name, group_chat_name
    FROM group_chat_core_table
    ${allFilters} 
    GROUP BY contact_name, is_from_me, group_chat_name
    ORDER BY ${sortColumn} DESC
    ${limitClause}
    `;

  return sqlite3Wrapper.allP(db, q);
}
