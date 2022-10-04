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

const POSSIBLE_COLORS: (
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'gray'
)[] = [
  'purple',
  'blue',
  'green',
  'red',
  'yellow',
  'orange',
  'pink',
  'teal',
  'gray',
];

export function createColorByContact(contactNames: string[]) {
  const contactByColor: Record<string, string> = {};

  // first get all the contactNames as set
  const set = new Set(contactNames);
  // then, sort that set
  const sortedNames = Array.from(set).sort();
  // now, assign a name to a color
  sortedNames.forEach((n, i) => {
    const index = (i + 1) % POSSIBLE_COLORS.length;
    const proposedColor = POSSIBLE_COLORS[index];
    // eslint-disable-next-line prefer-destructuring
    contactByColor[n] = theme.colors[proposedColor][300];
  });

  return contactByColor;
}

export function isDateInThisWeek(date: Date) {
  const todayObj = new Date();
  const todayDate = todayObj.getDate();
  const todayDay = todayObj.getDay();

  // get first date of week
  const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));

  // get last date of week
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

  // if date is equal or within the first and last dates of the week
  return date >= firstDayOfWeek && date <= lastDayOfWeek;
}
