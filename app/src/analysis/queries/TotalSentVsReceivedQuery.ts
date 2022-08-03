import * as sqlite3 from 'sqlite3';

import { filterOutReactions, GroupChatFilters } from '../../constants/filters';
import { objReplacementUnicode } from '../../constants/objReplacementUnicode';
import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { CoreTableNames } from '../tables/types';

export interface TotalSentVsReceivedFilters {
  contact?: string;
  groupChat?: string;
  word?: string;
}

interface TotalSentVsReceivedChartData {
  total: number;
  is_from_me: number;
}

export type TotalSentVsReceivedResults = TotalSentVsReceivedChartData[];

enum TotalSentVsReceivedOutputColumns {
  TOTAL = 'total',
  IS_FROM_ME = 'is_from_me',
}

enum TotalSentVsReceivedColumns {
  COUNT = 'count',
  FRIEND = 'friend',
  IS_FROM_ME = 'is_from_me',
  TEXT = 'text',
}

// TODO(Danilowicz): We should make these filters shared and more generic, as TopFriends also use them
function wordFilter(filters: TotalSentVsReceivedFilters): string | undefined {
  if (!filters.word || filters.word.length === 0) {
    return undefined;
  }
  // NOTE: using LIKE because the CORE_MAIN_TABLE is not split word by word
  return `LOWER(${
    TotalSentVsReceivedColumns.TEXT
  }) LIKE "%${filters.word?.toLowerCase()}%"`;
}

function contactFilter(
  filters: TotalSentVsReceivedFilters
): string | undefined {
  if (!filters.contact || filters.contact.length === 0) {
    return undefined;
  }
  return `${TotalSentVsReceivedColumns.FRIEND} = "${filters.contact}"`;
}

function groupChatFilter(
  filters: TotalSentVsReceivedFilters
): string | undefined {
  if (filters.groupChat === GroupChatFilters.ONLY_INDIVIDUAL) {
    return `cache_roomnames IS NULL`;
  }
  return undefined; // would query for both individual and groupchats
}

function fluffFilter(): string {
  return `
  ${filterOutReactions(TotalSentVsReceivedColumns.TEXT)} AND unicode(TRIM(${
    TotalSentVsReceivedColumns.TEXT
  })) != ${objReplacementUnicode}
  AND ${TotalSentVsReceivedColumns.TEXT} IS NOT NULL
  AND LENGTH(${TotalSentVsReceivedColumns.TEXT}) >= 1`;
}

function getAllFilters(filters: TotalSentVsReceivedFilters): string {
  const contact = contactFilter(filters);
  const groupChats = groupChatFilter(filters);
  const word = wordFilter(filters);
  const fluff = fluffFilter();

  const filtersArray = [contact, groupChats, word, fluff].filter(
    (filter) => !!filter
  );
  return filtersArray.length > 0 ? `WHERE ${filtersArray.join(' AND ')}` : '';
}

export async function queryTotalSentVsReceived(
  db: sqlite3.Database,
  filters: TotalSentVsReceivedFilters
): Promise<TotalSentVsReceivedResults> {
  const allFilters = getAllFilters(filters);
  const query = `
  SELECT COUNT(*) as ${TotalSentVsReceivedOutputColumns.TOTAL}, 
  is_from_me AS ${TotalSentVsReceivedOutputColumns.IS_FROM_ME}
  FROM ${CoreTableNames.CORE_MAIN_TABLE} 
  ${allFilters}
  GROUP BY ${TotalSentVsReceivedColumns.IS_FROM_ME}
  `;

  return sqlite3Wrapper.allP(db, query);
}
