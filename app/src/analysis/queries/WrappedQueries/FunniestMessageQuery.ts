import log from 'electron-log';
import * as sqlite3 from 'sqlite3';

import * as sqlite3Wrapper from '../../../utils/sqliteWrapper';
import {
  getAllFilters,
  SharedQueryFilters,
} from '../filters/sharedQueryFilters';

export type FunniestMessageResult = {
  groupChatName: string;
  funniestMessage: string;
  numberReactions: number;
  contactName: string;
};

export async function queryFunniestMessage(
  db: sqlite3.Database,
  filters: SharedQueryFilters
): Promise<FunniestMessageResult> {
  const allFilters = getAllFilters(filters, undefined, 'contact_name');

  const q = ``;

  const promise: Promise<
    {
      mostPopularCount: string;
      mostPopularDate: string;
    }[]
  > = sqlite3Wrapper.allP(db, q);

  const [data] = await Promise.all([promise]);

  if (data.length) {
    return {
      groupChatName: '',
      funniestMessage: '',
      numberReactions: 0,
      contactName: '',
    };
  }
  log.error('No data returned for funniest message');
  return {
    groupChatName: '',
    funniestMessage: '',
    numberReactions: 0,
    contactName: '',
  };
}
