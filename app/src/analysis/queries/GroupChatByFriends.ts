import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../utils/sqliteWrapper';

export type GroupChatByFriends = {
  count: number;
  contact_name: string;
  group_chat_name: string;
};

export async function queryGroupChatByFriends(
  db: sqlite3.Database
): Promise<GroupChatByFriends[]> {
  const q = `
    WITH GROUP_CHAT_NAMES AS (select
        group_concat(distinct contact_name) as participants,
        display_name,
        cmj.chat_id
    from
        chat c
        join chat_message_join cmj on cmj.chat_id = c."ROWID"
        join core_main_table m on m. "ROWID" = cmj.message_id
    group by
        c."ROWID"
    having
        count(distinct contact_name) > 1),
    
    -- texts in a group chat
    CORE_GROUP_CHAT_TABLE AS (
    SELECT 
    text,
    display_name,
    coalesce(contact_name, "you") as contact_name, 
    participants, is_from_me, 
    CASE WHEN display_name = "" THEN participants ELSE display_name END as group_chat_name 
    FROM core_main_table cm
    JOIN GROUP_CHAT_NAMES gcm
    on cm.chat_id  = gcm.chat_id )
    
    
    SELECT  COUNT(text) as count, contact_name, group_chat_name FROM CORE_GROUP_CHAT_TABLE 
    GROUP BY contact_name, is_from_me, group_chat_name
    `;

  return sqlite3Wrapper.allP(db, q);
}
