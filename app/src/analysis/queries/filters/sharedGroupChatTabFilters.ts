import { TimeRangeFilters } from 'constants/filters';

import { timeRangeFilter } from './sharedQueryFilters';

export interface SharedGroupChatTabQueryFilters {
  groupChatName: string;
  timeRange?: TimeRangeFilters;
}

export function groupChatNameFilter(filter: SharedGroupChatTabQueryFilters) {
  if (filter.groupChatName) {
    return `group_chat_name = '${filter.groupChatName}'`;
  }
  return undefined;
}

export function getAllGroupChatTabFilters(
  filters: SharedGroupChatTabQueryFilters,
  defaultFilters?: string
) {
  const timeRange = timeRangeFilter(filters);
  const groupChatName = groupChatNameFilter(filters);
  const filtersArray = [timeRange, groupChatName, defaultFilters].filter(
    (filter) => !!filter
  );
  return filtersArray.length > 0 ? `WHERE ${filtersArray.join(' AND ')}` : '';
}
