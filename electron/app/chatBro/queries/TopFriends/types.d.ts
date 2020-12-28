declare namespace TopFriendsTypes {
  interface Options {
    limit?: number;
  }

  interface ChartData {
    friend: string;
    count: number;
    phone_number: string;
  }
  type Results = ChartData[];
}
