export const DEFAULT_LIMIT = 15;

export enum GroupChatFilters {
  BOTH = 'Both Individual and Group Chats',
  ONLY_INDIVIDUAL = 'Only Individual Conversations',
}

export function filterOutReactions(column: string): string {
  return `
  (${column} IS NOT NULL
    AND (
      LOWER(${column}) NOT LIKE "emphasized%"
      AND LOWER(${column}) NOT LIKE "loved%"
      AND LOWER(${column}) NOT LIKE "liked%"
      AND LOWER(${column}) NOT LIKE "disliked%"
      AND LOWER(${column}) NOT LIKE "laughed%"
    ))
  `;
}
