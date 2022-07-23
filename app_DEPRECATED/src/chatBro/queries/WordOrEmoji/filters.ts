import _ from 'lodash';

import { emojis } from '../../constants/emojis';
import { GroupChatFilters } from '../../constants/filters';
import { objReplacementUnicode } from '../../constants/objReplacementUnicode';
import { punctuation } from '../../constants/punctuation';
import { reactions } from '../../constants/reactions';
import { stopWords } from '../../constants/stopWords';
import { Columns } from './columns';
import { IWordOrEmojiFilters } from './types';

function isFromMeFilter(filters: IWordOrEmojiFilters): string {
  if (filters.isFromMe === true) {
    return `${Columns.IS_FROM_ME} = 1`;
  }
  return `${Columns.IS_FROM_ME} = 0`;
}

function contactFilter(filters: IWordOrEmojiFilters): string | undefined {
  if (_.isEmpty(filters.contact)) {
    return undefined;
  }
  return `${Columns.CONTACT} = "${filters.contact}"`;
}

function wordFilter(filters: IWordOrEmojiFilters): string | undefined {
  if (_.isEmpty(filters.word)) {
    return undefined;
  }
  // NOTE: using '=' because WordOrEmojiTypes query is split word by word
  return `LOWER(${Columns.WORD}) = "${filters.word?.toLowerCase()}"`;
}

function isEmojiFilter(filters: IWordOrEmojiFilters): string {
  return `TRIM(${Columns.WORD}) ${
    filters.isEmoji ? 'IN ' : 'NOT IN'
  } (${emojis})`;
}

function groupChatFilter(filters: IWordOrEmojiFilters): string | undefined {
  if (filters.groupChat === GroupChatFilters.ONLY_INDIVIDUAL) {
    return `${Columns.CACHE_ROOMNAMES} IS NULL`;
  }
  return undefined; // would query for both individual and groupchats
}

function fluffFilter(): string {
  // NOTE: texts are LOWERed at this point
  return `TRIM(${Columns.WORD}) NOT IN (${stopWords})
  AND TRIM(${Columns.WORD}) NOT IN (${reactions})
  AND unicode(TRIM(${Columns.WORD})) != ${objReplacementUnicode}
  AND TRIM(${Columns.WORD}) NOT IN (${punctuation})
  AND LENGTH(${Columns.WORD}) >= 1`;
}

export default function getAllFilters(filters: IWordOrEmojiFilters): string {
  const contact = contactFilter(filters);
  const isEmoji = isEmojiFilter(filters);
  const isFromMe = isFromMeFilter(filters);
  const word = wordFilter(filters);
  const groupChat = groupChatFilter(filters);
  const fluff = fluffFilter();
  const filtersArray = _.compact([
    isFromMe,
    word,
    isEmoji,
    groupChat,
    fluff,
    contact,
  ]);
  return !_.isEmpty(filtersArray) ? `WHERE ${filtersArray.join(' AND ')}` : '';
}
