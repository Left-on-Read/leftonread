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
  filters: SharedGroupChatTabQueryFilters
): Promise<GroupChatByFriends[]> {
  const allFilters = getAllGroupChatTabFilters(filters);
  const q = `    
    SELECT COUNT(text) as count, contact_name, group_chat_name
    FROM group_chat_core_table
    ${allFilters} 
    GROUP BY contact_name, is_from_me, group_chat_name
    ORDER BY count DESC
    `;

  return sqlite3Wrapper.allP(db, q);
}
