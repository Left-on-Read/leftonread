import { IContactData } from 'components/Filters/ContactFilter';
import React, { useContext } from 'react';

export type TDateRange = {
  earliestDate: Date;
  latestDate: Date;
};

export type TGlobalContext = {
  isLoading: boolean;
  contacts: IContactData[];
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
    throw new Error(
      'useActiveOrgId must be used within a ActiveOrgIdContextProvider'
    );
  }

  return context;
}
