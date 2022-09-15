import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../../utils/sqliteWrapper';
import {
  getAllGroupChatTabFilters,
  SharedGroupChatTabQueryFilters,
} from '../filters/sharedGroupChatTabFilters';

export type GroupChatReactions = {
  count: number;
  contact_name: string;
  group_chat_name: string;
  reaction:
    | 'Loved'
    | 'Liked'
    | 'Disliked'
    | 'Laughed'
    | 'Questioned'
    | 'Emphasized';
  is_giving_reaction: string;
};

export async function queryGroupChatReactionsQuery(
  db: sqlite3.Database,
  filters: SharedGroupChatTabQueryFilters
): Promise<GroupChatReactions[]> {
  const allFilters = getAllGroupChatTabFilters(
    filters,
    'associated_text IS NOT NULL'
  );
  const q = `
    WITH GROUP_CHAT_REACTIONS AS (

    SELECT
    gct.text as reaction_text,
    gct.group_chat_name as group_chat_name ,
    gct.human_readable_date as human_readable_date,
    gct.contact_name as reactor_name,
    cmt.text as associated_text,
    CASE WHEN cmt.is_from_me = 1 THEN "you" ELSE cmt.coalesced_contact_name END as associated_receiver ,
    CASE 
    WHEN gct.associated_message_type  = 2000 THEN "Loved"
    WHEN gct.associated_message_type  = 2001 THEN "Liked"
    WHEN gct.associated_message_type  = 2002 THEN "Disliked"
    WHEN gct.associated_message_type  = 2003 THEN "Laughed"
    WHEN gct.associated_message_type  = 2004 THEN "Emphasized"
    WHEN gct.associated_message_type  = 2005 THEN "Questioned"
    END AS reaction
    FROM group_chat_core_table  gct
    LEFT JOIN core_main_table cmt
    ON cmt.guid = gct.associated_guid
    WHERE gct.associated_message_type BETWEEN 2000 AND 2005
    )

    -- REACTIONS GIVEN
    SELECT COUNT(*) as count, reactor_name as contact_name, group_chat_name, reaction, 1 as is_giving_reaction
    FROM GROUP_CHAT_REACTIONS 
    ${allFilters} 
    GROUP BY reaction, reactor_name
    UNION ALL
    -- REACTIONS RECEIVED
    SELECT COUNT(*) as count, associated_receiver as contact_name, group_chat_name, reaction, 0 as is_giving_reaction
    FROM GROUP_CHAT_REACTIONS 
    ${allFilters}
    GROUP BY reaction, associated_receiver
    ORDER BY reaction DESC
    `;

  return sqlite3Wrapper.allP(db, q);
}
