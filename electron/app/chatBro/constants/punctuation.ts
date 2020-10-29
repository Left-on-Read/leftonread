// TODO: this should be a regex instead
import delimList from '../util/delimList';

const punctuationList = [
  '?',
  '-',
  '—',
  '.',
  ',',
  '~',
  `'`,
  '#',
  '$',
  '%',
  '^',
  '&',
  '*',
  '(',
  ')',
  ':',
  ';',
  '!',
];
export const punctuation = delimList(punctuationList);
