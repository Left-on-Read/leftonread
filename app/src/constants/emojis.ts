import emojis from 'emojis-list';

import { delimList } from '../utils/delimList';

export const getEmojiData = () => {
  return delimList(emojis as unknown as string[]);
};
