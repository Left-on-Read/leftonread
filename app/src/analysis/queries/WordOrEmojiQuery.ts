import log from 'electron-log';
import * as sqlite3 from 'sqlite3';

import { getEmojiData } from '../../constants/emojis';
import { GroupChatFilters } from '../../constants/filters';
import { DEFAULT_FILTER_LIMIT } from '../../constants/index';
import { objReplacementUnicode } from '../../constants/objReplacementUnicode';
import { punctuation } from '../../constants/punctuation';
import { reactions } from '../../constants/reactions';
import { stopWords } from '../../constants/stopWords';
import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { ChatTableColumns } from '../tables/ChatTable';
import { ChatTableNames } from '../tables/types';

enum OutputColumns {
  WORD = 'word',
  COUNT = 'count',
}

export interface IWordOrEmojiFilters {
  contact?: string;
  word?: string;
  isFromMe: boolean;
  limit?: number;
  isEmoji: boolean;
  groupChat?: string;
}

export interface IWordOrEmojiChartData {
  word: string;
  count: number;
}

export type TWordOrEmojiResults = IWordOrEmojiChartData[];

function isFromMeFilter(filters: IWordOrEmojiFilters): string {
  if (filters.isFromMe === true) {
    return `${ChatTableColumns.IS_FROM_ME} = 1`;
  }
  return `${ChatTableColumns.IS_FROM_ME} = 0`;
}

function contactFilter(filters: IWordOrEmojiFilters): string | undefined {
  if (!filters.contact || filters.contact.length === 0) {
    return undefined;
  }
  return `${ChatTableColumns.CONTACT} = "${filters.contact}"`;
}

function wordFilter(filters: IWordOrEmojiFilters): string | undefined {
  if (!filters.word || filters.word.length === 0) {
    return undefined;
  }
  // NOTE: using '=' because WordOrEmojiTypes query is split word by word
  return `LOWER(${ChatTableColumns.WORD}) = "${filters.word?.toLowerCase()}"`;
}

async function isEmojiFilter(filters: IWordOrEmojiFilters): Promise<string> {
  const emojis = await getEmojiData();

  return `TRIM(${ChatTableColumns.WORD}) ${
    filters.isEmoji ? 'IN ' : 'NOT IN'
  } (${emojis})`;
}

function groupChatFilter(filters: IWordOrEmojiFilters): string | undefined {
  if (filters.groupChat === GroupChatFilters.ONLY_INDIVIDUAL) {
    return `${ChatTableColumns.CACHE_ROOMNAMES} IS NULL`;
  }
  return undefined; // would query for both individual and groupchats
}

function fluffFilter(): string {
  // NOTE: texts are LOWERed at this point
  return `TRIM(${ChatTableColumns.WORD}) NOT IN (${stopWords})
    AND TRIM(${ChatTableColumns.WORD}) NOT IN (${reactions})
    AND unicode(TRIM(${ChatTableColumns.WORD})) != ${objReplacementUnicode}
    AND TRIM(${ChatTableColumns.WORD}) NOT IN (${punctuation})
    AND LENGTH(${ChatTableColumns.WORD}) >= 1`;
}

async function getAllFilters(filters: IWordOrEmojiFilters): Promise<string> {
  const contact = contactFilter(filters);
  const isEmoji = await isEmojiFilter(filters);
  const isFromMe = isFromMeFilter(filters);
  const word = wordFilter(filters);
  const groupChat = groupChatFilter(filters);
  const fluff = fluffFilter();

  const filtersArray = [
    isFromMe,
    word,
    isEmoji,
    groupChat,
    fluff,
    contact,
  ].filter((filter) => !!filter);

  return filtersArray.length > 0 ? `WHERE ${filtersArray.join(' AND ')}` : '';
}

export async function queryEmojiOrWordCounts(
  db: sqlite3.Database,
  filters: IWordOrEmojiFilters
): Promise<TWordOrEmojiResults> {
  const limit = filters.limit || DEFAULT_FILTER_LIMIT;
  const allFilters = await getAllFilters(filters);
  const query = `
    WITH COUNT_TEXT_TB AS (
      SELECT
        COUNT(${ChatTableColumns.WORD}) as ${OutputColumns.COUNT},
        ${ChatTableColumns.WORD},
        ${ChatTableColumns.CONTACT},
        ${ChatTableColumns.IS_FROM_ME}
      FROM ${ChatTableNames.COUNT_TABLE}
        ${allFilters}
      GROUP BY ${ChatTableColumns.CONTACT}, ${ChatTableColumns.WORD}, ${ChatTableColumns.IS_FROM_ME}
    )

    SELECT
      SUM(${OutputColumns.COUNT}) as ${OutputColumns.COUNT},
      ${ChatTableColumns.WORD} as ${OutputColumns.WORD}
    FROM
      COUNT_TEXT_TB
    GROUP BY ${ChatTableColumns.WORD}
    ORDER BY ${OutputColumns.COUNT} DESC
    LIMIT ${limit}
  `;

  return sqlite3Wrapper.allP(db, query);
}
