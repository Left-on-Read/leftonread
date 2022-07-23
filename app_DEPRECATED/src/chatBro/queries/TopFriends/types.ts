export interface ITopFriendsFilters {
  limit?: number;
  contact?: string;
  word?: string;
  groupChat?: string;
}

export interface ITopFriendsChartData {
  friend: string;
  total: number;
  sent: number;
  received: number;
}

export type TTopFriendsResults = ITopFriendsChartData[];
