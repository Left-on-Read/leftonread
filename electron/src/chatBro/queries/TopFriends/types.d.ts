declare namespace TopFriendsTypes {
  interface Filters {
    limit?: number;
    contact?: string;
    word?: string;
  }

  interface ChartData {
    friend: string;
    total: number;
    sent: number;
    received: number;
  }

  type Results = ChartData[];
}
