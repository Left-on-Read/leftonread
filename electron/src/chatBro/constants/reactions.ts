import { delimList, lowerCaseList } from '../../utils';

const reactionsList = ['Laughed', 'Loved', 'Emphasized', 'Disliked', 'Liked'];
export const reactions = delimList(lowerCaseList(reactionsList));
