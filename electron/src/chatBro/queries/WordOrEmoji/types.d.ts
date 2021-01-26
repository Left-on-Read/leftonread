declare namespace WordOrEmojiTypes {
  interface Filters {
    contact?: string;
    word?: string;
    isFromMe: boolean;
    limit?: number;
    isEmoji: boolean;
  }

  interface ChartData {
    word: string;
    count: number;
  }
  type Results = ChartData[];
}
