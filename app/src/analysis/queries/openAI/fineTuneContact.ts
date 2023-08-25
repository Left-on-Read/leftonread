import fs from 'fs';
import path from 'path';
import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../../utils/sqliteWrapper';

export type FineTuneResult = {
  text: string;
  is_from_me: number;
  human_readable_date: number;
  contactName: string;
}[];

export async function queryIndividualContactDataForFineTuning(
  db: sqlite3.Database
): Promise<FineTuneResult> {
  const contactName = ''; // TODO
  const q = `
  SELECT text, is_from_me, human_readable_date  FROM core_main_table WHERE coalesced_contact_name = "${contactName}" AND 
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
  let formattedResults = [];
  let currentDate: number | null = null;
  const firstMessage = {
    role: 'system',
    content: '', // TODO
  };

  let messages: { role: string; content: string }[] = [firstMessage];

  // eslint-disable-next-line array-callback-return
  results.map((result) => {
    const resultDate = new Date(result.human_readable_date).setHours(
      0,
      0,
      0,
      0
    );
    if (currentDate !== resultDate) {
      if (messages.length > 1) {
        formattedResults.push({ messages });
        messages = [firstMessage];
      }
      currentDate = resultDate;
    }
    messages.push({
      // In the individual context, 1 means the message is from me (the user)
      role: result.is_from_me === 1 ? 'user' : 'assistant',
      content: result.text,
    });
  });
  if (messages.length > 0) {
    formattedResults.push({ messages });
  }

  formattedResults = formattedResults.filter((item) => {
    return item.messages.some((message) => message.role === 'user');
  });

  formattedResults = formattedResults.filter((item) => {
    return item.messages.some((message) => message.role === 'assistant');
  });

  const filePath = path.join(
    process.env.HOME || process.env.USERPROFILE || '',
    'Desktop/messages.jsonl'
  );
  const writeStream = fs.createWriteStream(filePath);
  formattedResults.forEach((item) => {
    writeStream.write(`${JSON.stringify(item)}\n`);
  });
  writeStream.end();
  console.log(
    `Wrote to ${filePath}, now use the python script to fine tune the model`
  );
  return formattedResults;
}
