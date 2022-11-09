import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../../utils/sqliteWrapper';
import { SharedGroupChatTabQueryFilters } from '../filters/sharedGroupChatTabFilters';
import { timeRangeFilter } from '../filters/sharedQueryFilters';

export type FunniestMessageResult = {
  groupChatName: string;
  funniestMessage: string;
  numberReactions: number;
  contactName: string;
}[];

export async function queryFunniestMessage(
  db: sqlite3.Database,
  filters: SharedGroupChatTabQueryFilters | undefined
): Promise<FunniestMessageResult> {
  let gcFilter = '';
  // TODO(Danilowicz): should just call getAllGroupChatTabFilters() here.
  // The todo is add group_chat_name as a possible filter.
  // The current bug is time range filter wont work on Analytics Tab for this query
  if (filters && filters.groupChatName) {
    gcFilter = `AND gct.group_chat_name = '${filters.groupChatName}'`;
  } else if (filters && filters.timeRange) {
    const timeRange = timeRangeFilter(filters, 'gct.human_readable_date');
    gcFilter = `AND ${timeRange}`;
  }

  const q = `    WITH CORE_REACTION_TB AS (SELECT
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
    WHERE (gct.associated_message_type BETWEEN 2000 AND 2005) AND cmt.text is not null ${gcFilter})
	
	SELECT COUNT(*) as numberReactions, 
    associated_text as funniestMessage, 
    associated_receiver as contactName, 
    group_chat_name as groupChatName
	FROM CORE_REACTION_TB WHERE reaction = "Laughed" 
	GROUP BY associated_text, associated_receiver
	ORDER BY numberReactions DESC
	LIMIT 1	
`;

  return sqlite3Wrapper.allP(db, q);
}
