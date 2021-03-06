import _ from 'lodash';

import { filterOutReactions, GroupChatFilters } from '../../constants/filters';
import { objReplacementUnicode } from '../../constants/objReplacementUnicode';
import { Columns } from './columns';
import { ITopFriendsFilters } from './types';

function wordFilter(filters: ITopFriendsFilters): string | undefined {
  if (_.isEmpty(filters.word)) {
    return undefined;
  }
  // NOTE: using LIKE because TopFriends query is not split word by word
  return `LOWER(${Columns.TEXT}) LIKE "%${filters.word?.toLowerCase()}%"`;
}

function contactFilter(filters: ITopFriendsFilters): string | undefined {
  if (_.isEmpty(filters.contact)) {
    return undefined;
  }
  return `${Columns.FRIEND} = "${filters.contact}"`;
}

function groupChatFilter(filters: ITopFriendsFilters): string | undefined {
  if (filters.groupChat === GroupChatFilters.ONLY_INDIVIDUAL) {
    return `cache_roomnames IS NULL`;
  }
  return undefined; // would query for both individual and groupchats
}

function fluffFilter(): string {
  return `
  ${filterOutReactions(Columns.TEXT)} AND unicode(TRIM(${
    Columns.TEXT
  })) != ${objReplacementUnicode}
  AND ${Columns.TEXT} IS NOT NULL
  AND LENGTH(${Columns.TEXT}) >= 1`;
}

export default function getAllFilters(filters: ITopFriendsFilters): string {
  const contact = contactFilter(filters);
  const groupChats = groupChatFilter(filters);
  const word = wordFilter(filters);
  const fluff = fluffFilter();
  const filtersArray = _.compact([contact, groupChats, word, fluff]);
  return !_.isEmpty(filtersArray) ? `WHERE ${filtersArray.join(' AND ')}` : '';
}
