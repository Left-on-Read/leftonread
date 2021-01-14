declare namespace WordOrEmojiTypes {
  interface Options {
    contact?: string;
    word?: string;
    isFromMe?: boolean;
    limit?: number;
    isEmoji?: boolean;
  }

  interface ChartData {
    word: string;
    count: number;
  }
  type Results = ChartData[];
}
