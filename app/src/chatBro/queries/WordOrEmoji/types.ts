export interface IWordOrEmojiFilters {
  contact?: string;
  word?: string;
  isFromMe: boolean;
  limit?: number;
  isEmoji: boolean;
  groupChat?: string;
}

export interface IWordOrEmojiChartData {
  word: string;
  count: number;
}

export type TWordOrEmojiResults = IWordOrEmojiChartData[];
