import { GroupChatFilters } from '../../../constants/filters';

export interface SharedQueryFilters {
  limit?: number;
  contact?: string;
  word?: string;
  groupChat?: GroupChatFilters;
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
  return `${columnName} = "${filters.contact}"`;
}

export function groupChatFilter(
  filters: SharedQueryFilters
): string | undefined {
  if (filters.groupChat === GroupChatFilters.ONLY_INDIVIDUAL) {
    return `cache_roomnames IS NULL`;
  }
  return undefined; // would query for both individual and groupchats
}

export function getAllFilters(
  filters: SharedQueryFilters,
  defaultFilterStatement?: string,
  contactColumnName?: string
): string {
  const contact = contactFilter(filters, contactColumnName ?? 'friend');
  const groupChats = groupChatFilter(filters);
  const word = wordFilter(filters);

  const filtersArray = [
    contact,
    groupChats,
    word,
    defaultFilterStatement,
  ].filter((filter) => !!filter);

  return filtersArray.length > 0 ? `WHERE ${filtersArray.join(' AND ')}` : '';
}
