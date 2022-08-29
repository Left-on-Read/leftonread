import { GroupChatFilters, TimeRangeFilters } from '../../../constants/filters';
import { delimList } from '../../../utils/delimList';
import { CoreMainTableColumns } from '../../tables/CoreTable';
import { ContactOptionsQueryResult } from '../ContactOptionsQuery';

export interface SharedQueryFilters {
  limit?: number;
  contact?: ContactOptionsQueryResult[];
  word?: string;
  groupChat?: GroupChatFilters;
  timeRange?: TimeRangeFilters;
}

export interface SharedGroupChatTabQueryFilters {
  groupChatName: string;
  timeRange?: TimeRangeFilters;
}

function wordFilter(filters: SharedQueryFilters): string | undefined {
  if (!filters.word || filters.word.length === 0) {
    return undefined;
  }
  // NOTE: using LIKE because CORE_MAIN_TABLE table is not split word by word
  return `LOWER(text) LIKE "%${filters.word?.toLowerCase()}%"`;
}

function contactFilter(
  filters: SharedQueryFilters,
  columnName: string
): string | undefined {
  if (!filters.contact || filters.contact.length === 0) {
    return undefined;
  }
  return `${columnName} IN (${delimList(filters.contact.map((c) => c.label))})`;
}

export function groupChatFilter(
  filters: SharedQueryFilters
): string | undefined {
  if (filters.groupChat === GroupChatFilters.ONLY_INDIVIDUAL) {
    return `cache_roomnames IS NULL`;
  }
  return undefined; // would query for both individual and groupchats
}

export function timeRangeFilter(
  filters: SharedQueryFilters
): string | undefined {
  if (!filters.timeRange) {
    return undefined;
  }

  const { startDate, endDate } = filters.timeRange;

  const parsedStartDate = `"${startDate.toISOString().split('T')[0]} 00:00:00"`;
  const parsedEndDate = `"${endDate.toISOString().split('T')[0]} 23:59:59"`;

  return `${CoreMainTableColumns.DATE} BETWEEN ${parsedStartDate} AND ${parsedEndDate}`;
}

export function getAllFilters(
  filters: SharedQueryFilters,
  defaultFilterStatement?: string,
  contactColumnName?: string
): string {
  const contact = contactFilter(filters, contactColumnName ?? 'friend');
  const groupChats = groupChatFilter(filters);
  const word = wordFilter(filters);
  const timeRange = timeRangeFilter(filters);

  const filtersArray = [
    contact,
    groupChats,
    word,
    defaultFilterStatement,
    timeRange,
  ].filter((filter) => !!filter);

  return filtersArray.length > 0 ? `WHERE ${filtersArray.join(' AND ')}` : '';
}
