/* eslint-disable import/prefer-default-export */

// TOOD: this should be a regex instead
import delimList from '../util/constantsHelper';

const punctuationList = ["?", "-", "—", ".", ",", "~", `'`, "#", "$", "%", "^", "&", "*", "(", ")", ":", ";", "!"];
export const punctuation = delimList(punctuationList);
