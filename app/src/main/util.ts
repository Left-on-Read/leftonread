import { theme } from '@chakra-ui/react';
import * as fs from 'fs';
import path from 'path';
import { URL } from 'url';

import { appDirectoryPath } from '../analysis/directories';

// eslint-disable-next-line import/no-mutable-exports
export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

export function daysAgo(date1: Date, date2: Date) {
  const differenceInTime = date2.getTime() - date1.getTime();
  return Math.round(differenceInTime / (1000 * 3600 * 24));
}

export function shuffleArray(array: string[]) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function checkIsInitialized() {
  return !!fs.existsSync(appDirectoryPath);
}

const POSSIBLE_COLORS: ('gray' | 'green' | 'blue' | 'purple' | 'pink')[] = [
  'gray',
  'green',
  'blue',
  'purple',
  'pink',
];
const POSSIBLE_WEIGHTS: (200 | 300)[] = [200, 300];
export function getRandomColorFromTheme() {
  const proposedColor =
    POSSIBLE_COLORS[Math.floor(Math.random() * POSSIBLE_COLORS.length)];
  return theme.colors[proposedColor][
    POSSIBLE_WEIGHTS[Math.floor(Math.random() * POSSIBLE_WEIGHTS.length)]
  ];
}
