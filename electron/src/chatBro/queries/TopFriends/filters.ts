import _ from 'lodash';
import { Columns } from './columns';
import { GroupChatFilters } from '../../constants/filters';

function wordFilter(filters: TopFriendsTypes.Filters): string | undefined {
  if (_.isEmpty(filters.word)) {
    return undefined;
  }
  // NOTE: using LIKE because TopFriends query is not split word by word
  return `LOWER(${Columns.TEXT}) LIKE "%${filters.word?.toLowerCase()}%"`;
}

function contactFilter(filters: TopFriendsTypes.Filters): string | undefined {
  if (_.isEmpty(filters.contact)) {
    return undefined;
  }
  return `${Columns.FRIEND} = "${filters.contact}"`;
}

function groupChatFilter(filters: TopFriendsTypes.Filters): string | undefined {
  if (filters.groupChat === GroupChatFilters.ONLY_INDIVIDUAL) {
    return `message.cache_roomnames IS NULL`;
  }
  return undefined; // would query for both individual and groupchats
}

export default function getAllFilters(
  filters: TopFriendsTypes.Filters
): string {
  const contact = contactFilter(filters);
  const groupChats = groupChatFilter(filters);
  const word = wordFilter(filters);
  const filtersArray = _.compact([contact, groupChats, word]);
  return !_.isEmpty(filtersArray) ? `WHERE ${filtersArray.join(' AND ')}` : '';
}
