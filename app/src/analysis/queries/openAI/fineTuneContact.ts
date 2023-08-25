import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../../utils/sqliteWrapper';

export type FineTuneResult = {
  text: string;
  is_from_me: string;
  human_readable_date: number;
  contactName: string;
}[];

export async function queryIndividualContactDataForFineTuning(
  db: sqlite3.Database
): Promise<FineTuneResult> {
  const q = `
  SELECT text, is_from_me, human_readable_date  FROM core_main_table WHERE coalesced_contact_name = "Jackie Chen" AND 
    LOWER(text) NOT LIKE "emphasized%"
    AND LOWER(text) NOT LIKE "emphasised%"
    AND LOWER(text) NOT LIKE "loved%"
    AND LOWER(text) NOT LIKE "liked%"
    AND LOWER(text) NOT LIKE "disliked%"
    AND LOWER(text) NOT LIKE "laughed%"
    AND cache_roomnames IS NULL
    ORDER BY human_readable_date
`;

  return sqlite3Wrapper.allP(db, q);
}

export async function prepareFineTuneContact(db: sqlite3.Database) {
  // Reformat the results to the required format:
  // Each message should have a 'role' and 'content'. The 'role' is 'user' if 'is_from_me' is 0, and 'assistant' if 'is_from_me' is 1.
  // A new 'messages' array should be started when the date changes.
  const results = await queryIndividualContactDataForFineTuning(db);
  const formattedResults = [];
  let currentDate: number | null = null;
  let messages: { role: string; content: string }[] = [];

  // eslint-disable-next-line array-callback-return
  results.map((result) => {
    const resultDate = new Date(result.human_readable_date).setHours(
      0,
      0,
      0,
      0
    );
    if (currentDate !== resultDate) {
      if (messages.length > 0) {
        formattedResults.push({ messages });
        messages = [];
      }
      currentDate = resultDate;
    }
    messages.push({
      role: result.is_from_me === '0' ? 'user' : 'assistant',
      content: result.text,
    });
  });
  if (messages.length > 0) {
    formattedResults.push({ messages });
  }
  console.log(formattedResults);
  return formattedResults;
}
