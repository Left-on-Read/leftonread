import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../../utils/sqliteWrapper';

export type FineTuneResult = {
  text: string;
  is_from_me: string;
  human_readable_data: number;
  contactName: string;
}[];

export async function queryGetDataForFineTuning(
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
    ORDER BY human_readable_date
`;

  return sqlite3Wrapper.allP(db, q);
}

export async function prepareFineTuneContact(db: sqlite3.Database) {
  console.log('hi');
  console.log('results');
  const results = await queryGetDataForFineTuning(db);
  console.log(results);
}
