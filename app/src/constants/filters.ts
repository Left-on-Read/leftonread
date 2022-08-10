export const DEFAULT_LIMIT = 15;

export enum GroupChatFilters {
  BOTH = 'Both Individual and Group Chats (makes received higher & keeps sent the same)',
  ONLY_INDIVIDUAL = 'Only Individual Conversations',
}

// TODO(Danilowicz) this should leverage constants/reactions
export function filterOutReactions(): string {
  return `(
    LOWER(text) NOT LIKE "emphasized%"
    AND LOWER(text) NOT LIKE "loved%"
    AND LOWER(text) NOT LIKE "liked%"
    AND LOWER(text) NOT LIKE "disliked%"
    AND LOWER(text) NOT LIKE "laughed%"
  )`;
}
