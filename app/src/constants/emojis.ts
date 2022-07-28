import * as unicodeEmoji from 'unicode-emoji';
import { delimList } from 'utils/delimList';

const emojiData = unicodeEmoji.getEmojis();
const emojiList = emojiData.map((emojiDataObj) => emojiDataObj.emoji);

export const emojis = delimList(emojiList);
