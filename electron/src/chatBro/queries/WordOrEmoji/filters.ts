import * as _ from 'lodash';
import { emojis } from '../../constants/emojis';
import { Columns } from '../../../tables/Core/Count';

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
  return `${Columns.WORD} = "${filters.word}"`;
}

function isEmojiFilter(filters: WordOrEmojiTypes.Filters): string {
  if (filters.isEmoji === true) {
    return `TRIM(${Columns.WORD}) IN (${emojis})`;
  }
  return `TRIM(${Columns.WORD}) NOT IN (${emojis})`;
}

// Attaches each filter in a combined WHERE clause.
export default function getAllFilters(
  filters: WordOrEmojiTypes.Filters
): string {
  const isEmoji = isEmojiFilter(filters);
  const isFromMe = isFromMeFilter(filters);
  const word = wordFilter(filters);
  const filtersArray = _.compact([isFromMe, word, isEmoji]);
  return !_.isEmpty(filtersArray) ? `WHERE ${filtersArray.join(' AND ')}` : '';
}
