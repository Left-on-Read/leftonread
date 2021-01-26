import _ from 'lodash';
import { emojis } from '../../constants/emojis';
import { Columns } from './columns';

function isFromMeFilter(filters: WordOrEmojiTypes.Filters): string {
  if (filters.isFromMe === true) {
    return `${Columns.IS_FROM_ME} = 1`;
  }
  return `${Columns.IS_FROM_ME} = 0`;
}

function wordFilter(filters: WordOrEmojiTypes.Filters): string | undefined {
  if (_.isEmpty(filters.word)) {
    return undefined;
  }
  // NOTE: using '=' because WordOrEmojiTypes query is split word by word
  return `LOWER(${Columns.WORD}) = "${filters.word?.toLowerCase()}"`;
}

function isEmojiFilter(filters: WordOrEmojiTypes.Filters): string {
  return `TRIM(${Columns.WORD}) ${
    filters.isEmoji ? 'IN ' : 'NOT IN'
  } (${emojis})`;
}

export default function getAllFilters(
  filters: WordOrEmojiTypes.Filters
): string {
  const isEmoji = isEmojiFilter(filters);
  const isFromMe = isFromMeFilter(filters);
  const word = wordFilter(filters);
  const filtersArray = _.compact([isFromMe, word, isEmoji]);
  return !_.isEmpty(filtersArray) ? `WHERE ${filtersArray.join(' AND ')}` : '';
}
