import * as sqlite3 from 'sqlite3';

import { getEmojiData } from '../../constants/emojis';
import { DEFAULT_FILTER_LIMIT } from '../../constants/index';
import { objReplacementUnicode } from '../../constants/objReplacementUnicode';
import { punctuation } from '../../constants/punctuation';
import { reactions } from '../../constants/reactions';
import { stopWords } from '../../constants/stopWords';
import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { ChatTableColumns } from '../tables/ChatTable';
import { ChatTableNames } from '../tables/types';
import { groupChatFilter } from './filters/sharedQueryFilters';

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

function isEmojiFilter(filters: IWordOrEmojiFilters): string {
  const emojis = getEmojiData();

  return `TRIM(${ChatTableColumns.WORD}) ${
    filters.isEmoji ? 'IN ' : 'NOT IN'
  } (${emojis})`;
}

function wordFluffFilter(): string {
  // NOTE: texts are LOWERed at this point
  return `TRIM(${ChatTableColumns.WORD}) NOT IN (${stopWords})
    AND TRIM(${ChatTableColumns.WORD}) NOT IN (${reactions})
    AND unicode(TRIM(${ChatTableColumns.WORD})) != ${objReplacementUnicode}
    AND TRIM(${ChatTableColumns.WORD}) NOT IN (${punctuation})
    AND LENGTH(${ChatTableColumns.WORD}) >= 1`;
}

// NOTE(Danilowicz): All of these filters are specific to WORDs, as opposed to whole "texts"
function getAllWordLevelFilters(filters: IWordOrEmojiFilters): string {
  const contact = contactFilter(filters);
  const isEmoji = isEmojiFilter(filters);
  const isFromMe = isFromMeFilter(filters);
  const word = wordFilter(filters);
  const groupChat = groupChatFilter(filters);
  const fluff = wordFluffFilter();

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
  const wordLevelFilters = getAllWordLevelFilters(filters);
  const q = `
    WITH COUNT_TEXT_TB AS (
      SELECT
        COUNT(${ChatTableColumns.WORD}) as ${OutputColumns.COUNT},
        ${ChatTableColumns.WORD},
        ${ChatTableColumns.CONTACT},
        ${ChatTableColumns.IS_FROM_ME}
      FROM ${ChatTableNames.COUNT_TABLE}
        ${wordLevelFilters}
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
  // log.info(q)
  return sqlite3Wrapper.allP(db, q);
}
