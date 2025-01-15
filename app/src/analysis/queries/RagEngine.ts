import OpenAI from 'openai';
import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../utils/sqliteWrapper';

// A test function for me to understand the altered DB schema better :)
export async function printDBTableNames(
  db: sqlite3.Database
): Promise<string[]> {
  const q = `
  SELECT 
    name 
  FROM 
    sqlite_master 
  WHERE 
    type='table' 
  ORDER BY 
    name
  `;
  return sqlite3Wrapper.allP(db, q);
}

// Put together a really hacky RAG pipeline...
export async function queryRAGEngine(
  db: sqlite3.Database,
  message: string,
  key: string
): Promise<string> {
  const openai = new OpenAI({
    apiKey: key,
  });

  let q: string | null = null;

  let prompt = `
  Write a query for a table called core_main_table with this schema: 
  contact_name, 
  text (which has the message's text), 
  date (a unix timestamp number in nanoseconds when the message was sent),
  is_from_me (a boolean indicating if I was the sender of the message) 
  
  to answer the following query: ${message}
  Please respond with only the raw unformatted SQL and no other text. If this is not possible, or it's hard to get a concrete result based on the schema, return 'Not Possible'
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Change the model as per your requirement
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });
    q = response.choices[0].message.content;
    console.log(response.choices[0]);
  } catch (error) {
    console.error(error);
    return new Promise<string>((resolve, reject) => {
      resolve('An error occurred. Check your API key and try a new message.');
    });
  }

  const query = `
  SELECT COUNT(*) AS message_count
  FROM core_main_table
  WHERE LOWER(contact_name) = LOWER('${message}');
  `;

  const queryResult = await sqlite3Wrapper.allP(db, q ?? query);

  function isObject(value: any): value is Record<string, any> {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    );
  }
  if (!isObject(queryResult[0])) {
    console.log(queryResult[0]);
  }
  const resultString = JSON.stringify(queryResult[0]);
  // Sanity check so you don't use don't accidentally use too many tokens...
  if (resultString.length > 10000) {
    return new Promise<string>((resolve, reject) => {
      resolve('An error occurred. Try a new message.');
    });
  }

  prompt = `
  Given this message from a user: ${message}, 
  this corresponding generated query over a database: ${query}, 
  and this result of the query ${resultString}:
  interpret the result of the query in plain english as a response to the initial message.
  `;

  let result = '';
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Change the model as per your requirement
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });
    result = response.choices[0].message.content ?? 'An error occurred';
    console.log(response.choices[0]);
  } catch (error) {
    console.error(error);
    return new Promise<string>((resolve, reject) => {
      resolve('An error occurred. Check your API key and try a new message.');
    });
  }

  return new Promise<string>((resolve, reject) => {
    resolve(result); // Resolve the promise with a string value
  });
}
