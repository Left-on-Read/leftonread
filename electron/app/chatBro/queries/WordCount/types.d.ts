declare namespace WordCountTypes {
  interface Options {
    contact?: string;
    word?: string;
    isFromMe?: boolean;
    limit?: number;
  }
  
  interface ChartData {
    word: string;
    count: number;
  }
  type Results = ChartData[];
}
