import log from 'electron-log';

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

function wordFilter(filters: SharedQueryFilters): string | undefined {
  if (!filters.word || filters.word.length === 0) {
    return undefined;
  }
  // NOTE: using LIKE because CORE_MAIN_TABLE table is not split word by word
  return `LOWER(text) LIKE "%${filters.word?.toLowerCase()}%"`;
}

export function contactFilter(filters: SharedQueryFilters): string | undefined {
  if (!filters.contact || filters.contact.length === 0) {
    return undefined;
  }
  const convertListToLikeStatements = (
    contacts: ContactOptionsQueryResult[]
  ) => {
    return contacts
      .map(
        (c) =>
          `OR contact_name_with_group_chat_participants_populated LIKE '%${c.label}%'`
      )
      .join('');
  };

  const final = `(contact_name_with_group_chat_participants_populated IN (${delimList(
    filters.contact.map((c) => c.label)
  )}) ${convertListToLikeStatements(filters.contact)})`;
  return final;
}

export function groupChatFilter(
  filters: SharedQueryFilters
): string | undefined {
  log.info(filters.groupChat);
  if (filters.groupChat === GroupChatFilters.ONLY_INDIVIDUAL) {
    return `room_name IS NULL`;
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
  defaultFilterStatement?: string
): string {
  const contact = contactFilter(filters);
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

  const finalFilter =
    filtersArray.length > 0 ? `WHERE ${filtersArray.join(' AND ')}` : '';
  console.log(finalFilter);
  return finalFilter;
}
