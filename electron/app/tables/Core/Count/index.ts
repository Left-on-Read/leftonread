import { reactions } from '../../../chatBro/constants/reactions';
import { emojis } from '../../../chatBro/constants/emojis';
import { stopWords } from '../../../chatBro/constants/stopWords';
import { objReplacementUnicode } from '../../../chatBro/constants/objReplacementUnicode';
import { punctuation } from '../../../chatBro/constants/punctuation';
import { Columns as ContactNameColumns } from '../../ContactTable';

interface Columns {
  WORD: string;
  COUNT: string;
}

/* TODO(Danilowicz):
 *  The majority of this query should only run once.
 *  We should create the SPLIT_TEXT_TABLE once, and then filter on it
 *  for emojis or words.
 *
 *  This should involve some disussion. As we will be introducing
 *  the idea of a "core" table
 */
export default function getCoreCountTable(
  columns: Columns,
  isEmojiCount: boolean
) {
  return `WITH RECURSIVE SPLIT_TEXT_TABLE (id, is_from_me, guid, text, etc) AS
  (
    SELECT
      coalesce(h.${
        ContactNameColumns.CONTACT_NAME
      }, h.id) as id, m.is_from_me, m.guid, '', m.text || ' '
    FROM message m
    JOIN
      handle h
    ON
      h.ROWID = handle_id
      WHERE m.text IS NOT NULL
    UNION ALL
    SELECT
      id, is_from_me, guid, SUBSTR(etc, 0, INSTR(etc, ' ')), SUBSTR(etc, INSTR(etc, ' ')+1)
    FROM SPLIT_TEXT_TABLE
    WHERE etc <> ''
  )
    SELECT
      id as contact, text as ${columns.WORD}, is_from_me, COUNT(text) as ${
    columns.COUNT
  }
    FROM SPLIT_TEXT_TABLE
      WHERE TRIM(LOWER(text)) NOT IN (${stopWords})
      AND TRIM(text) NOT IN (${reactions})
      AND TRIM(text) ${isEmojiCount ? 'IN' : 'NOT IN'} (${emojis})
      AND unicode(TRIM(LOWER(text))) != ${objReplacementUnicode}
      AND TRIM(text) NOT IN (${punctuation})
    GROUP BY id, text, is_from_me;
`;
}
