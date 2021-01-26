declare namespace TopFriendsTypes {
  interface Filters {
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
