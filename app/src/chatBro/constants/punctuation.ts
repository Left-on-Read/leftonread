// TODO(Danilowicz): this should be a regex instead
import { delimList } from '../../utils';

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
  '--',
  '---',
  '—',
];
export const punctuation = delimList(punctuationList);
