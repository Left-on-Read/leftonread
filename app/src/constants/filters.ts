export const DEFAULT_LIMIT = 15;

export enum GroupChatFilters {
  BOTH = 'Both Individual and Group Chats',
  ONLY_INDIVIDUAL = 'Only Individual Conversations',
}

export type TimeRangeFilters = {
  startDate: Date;
  endDate?: Date; // uses tomorrow by default
};

// TODO(Danilowicz) this should leverage constants/reactions
export function filterOutReactions(): string {
  return `(
    LOWER(text) NOT LIKE "emphasized%"
    AND LOWER(text) NOT LIKE "emphasised%"
    AND LOWER(text) NOT LIKE "loved%"
    AND LOWER(text) NOT LIKE "liked%"
    AND LOWER(text) NOT LIKE "disliked%"
    AND LOWER(text) NOT LIKE "laughed%"
  )`;
}
