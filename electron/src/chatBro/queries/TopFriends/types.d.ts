declare namespace TopFriendsTypes {
  interface Options {
    limit?: number;
  }

  interface ChartData {
    friend: string;
    total: number;
    sent: number;
    received: number;
  }
  type Results = ChartData[];
}
