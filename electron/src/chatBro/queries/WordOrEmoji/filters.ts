import _ from 'lodash';
import { emojis } from '../../constants/emojis';
import { Columns } from './columns';
import { GroupChatFilters } from '../../constants/filters';
import { reactions } from '../../constants/reactions';
import { stopWords } from '../../constants/stopWords';
import { objReplacementUnicode } from '../../constants/objReplacementUnicode';
import { punctuation } from '../../constants/punctuation';

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

function groupChatFilter(
  filters: WordOrEmojiTypes.Filters
): string | undefined {
  if (filters.groupChat === GroupChatFilters.ONLY_INDIVIDUAL) {
    return `${Columns.CACHE_ROOMNAMES} IS NULL`;
  }
  return undefined; // would query for both individual and groupchats
}

function fluffFilter(): string {
  // NOTE: Text is LOWERed at this point.
  return `TRIM(${Columns.WORD}) NOT IN (${stopWords})
  AND TRIM(${Columns.WORD}) NOT IN (${reactions})
  AND unicode(TRIM(${Columns.WORD})) != ${objReplacementUnicode}
  AND TRIM(${Columns.WORD}) NOT IN (${punctuation})`;
}

export default function getAllFilters(
  filters: WordOrEmojiTypes.Filters
): string {
  const isEmoji = isEmojiFilter(filters);
  const isFromMe = isFromMeFilter(filters);
  const word = wordFilter(filters);
  const groupChat = groupChatFilter(filters);
  const fluff = fluffFilter();
  const filtersArray = _.compact([isFromMe, word, isEmoji, groupChat, fluff]);
  return !_.isEmpty(filtersArray) ? `WHERE ${filtersArray.join(' AND ')}` : '';
}
