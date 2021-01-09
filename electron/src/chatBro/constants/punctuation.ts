// TODO(Danilowicz): this should be a regex instead
import delimList from '../../utils/delimList';

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
