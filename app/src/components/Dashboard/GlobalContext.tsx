import { ContactOptionsQueryResult } from 'analysis/queries/ContactOptionsQuery';
import React, { useContext } from 'react';

export type TDateRange = {
  earliestDate: Date;
  latestDate: Date;
};

export type TGlobalContext = {
  isLoading: boolean;
  contacts?: ContactOptionsQueryResult[];
  dateRange: TDateRange;
};

export const GlobalContext = React.createContext<TGlobalContext>({
  isLoading: true,
  contacts: [],
  dateRange: {
    earliestDate: new Date(),
    latestDate: new Date(),
  },
});

export function useGlobalContext() {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error('Context is undefined');
  }

  return context;
}
