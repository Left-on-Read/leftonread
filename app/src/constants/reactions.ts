import { delimList } from '../utils/delimList';
import { lowerCaseList } from '../utils/lowerCaseList';

const reactionsList = ['Laughed', 'Loved', 'Emphasized', 'Disliked', 'Liked'];
export const reactions = delimList(lowerCaseList(reactionsList));
