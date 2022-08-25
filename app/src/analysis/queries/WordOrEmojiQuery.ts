import { GroupChatFilters } from 'constants/filters';
import * as sqlite3 from 'sqlite3';

import { getEmojiData } from '../../constants/emojis';
import { DEFAULT_FILTER_LIMIT } from '../../constants/index';
import { objReplacementUnicode } from '../../constants/objReplacementUnicode';
import { punctuation } from '../../constants/punctuation';
import { reactions } from '../../constants/reactions';
import { stopWords } from '../../constants/stopWords';
import * as sqlite3Wrapper from '../../utils/sqliteWrapper';
import { ChatTableNames } from '../tables/types';
import { ContactOptionsQueryResult } from './ContactOptionsQuery';
import { contactFilter, groupChatFilter } from './filters/sharedQueryFilters';

enum OutputColumns {
  WORD = 'word',
  COUNT = 'count',
}

export interface IWordOrEmojiFilters {
  contact?: ContactOptionsQueryResult[];
  word?: string;
  isFromMe: boolean;
  limit?: number;
  isEmoji: boolean;
  groupChat?: GroupChatFilters;
}

export interface IWordOrEmojiChartData {
  word: string;
  count: number;
}

export type TWordOrEmojiResults = IWordOrEmojiChartData[];

function isFromMeFilter(filters: IWordOrEmojiFilters): string {
  if (filters.isFromMe === true) {
    return `is_from_me = 1`;
  }
  return `is_from_me = 0`;
}

function wordFilter(filters: IWordOrEmojiFilters): string | undefined {
  if (!filters.word || filters.word.length === 0) {
    return undefined;
  }
  // NOTE: using '=' because WordOrEmojiTypes query is split word by word
  return `LOWER(word) = "${filters.word?.toLowerCase()}"`;
}

function isEmojiFilter(filters: IWordOrEmojiFilters): string {
  const emojis = getEmojiData();

  return `TRIM(word) ${filters.isEmoji ? 'IN ' : 'NOT IN'} (${emojis})`;
}

function wordFluffFilter(): string {
  // NOTE: texts are LOWERed at this point
  return `TRIM(word) NOT IN (${stopWords})
    AND TRIM(word) NOT IN (${reactions})
    AND unicode(TRIM(word)) != ${objReplacementUnicode}
    AND TRIM(word) NOT IN (${punctuation})
    AND LENGTH(word) >= 1`;
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
        COUNT(word) as ${OutputColumns.COUNT},
        -- TODO(Danilowicz): I understand this is ugly and hardcoded... should use regex.
        -- https://stackoverflow.com/questions/13240298/remove-numbers-from-string-sql-server
        REPLACE
        (REPLACE
        (REPLACE
        (REPLACE
        (REPLACE
        (REPLACE
        (REPLACE
        (REPLACE
        (REPLACE
        (REPLACE
        (REPLACE
        (REPLACE (
          replace(
            replace(
              replace(
                replace(
                  replace(
                    word,
                  ',', ""),
                '!',""),
              '!!', ""),
            '.', ""),
          '*', "")
        , '0', ''),
        '1', ''),
        '2', ''),
        '3', ''),
        '4', ''),
        '5', ''),
        '6', ''),
        '7', ''),
        '8', ''),
        '9', ''),
        '?', ''),
        ':', '') as word,
        contact,
        is_from_me
      FROM ${ChatTableNames.COUNT_TABLE}
        ${wordLevelFilters}
      GROUP BY contact, word, is_from_me
    )

    SELECT
      SUM(${OutputColumns.COUNT}) as ${OutputColumns.COUNT},
      word as ${OutputColumns.WORD}
    FROM
      COUNT_TEXT_TB
    WHERE LENGTH(word) >= 1
    GROUP BY word
    ORDER BY ${OutputColumns.COUNT} DESC
    LIMIT ${limit}
  `;
  // log.info(q)
  return sqlite3Wrapper.allP(db, q);
}
