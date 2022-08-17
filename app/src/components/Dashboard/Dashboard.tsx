import { EarliestAndLatestDateResults } from 'analysis/queries/EarliestAndLatestDatesQuery';
import { SharedQueryFilters } from 'analysis/queries/filters/sharedQueryFilters';
import { IContactData } from 'components/Filters/ContactFilter';
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';

import { DEFAULT_QUERY_FILTERS } from '../Filters/FilterPanel';
import { Footer } from '../Footer';
import { ChartTabs } from './ChartTabs';
import { GlobalContext, TGlobalContext } from './GlobalContext';
import { Navbar } from './Navbar';

export function Dashboard({ onRefresh }: { onRefresh: () => void }) {
  const [filters, setFilters] = useState<SharedQueryFilters>(
    DEFAULT_QUERY_FILTERS
  );

  const [globalData, setGlobalData] = useState<TGlobalContext>({
    isLoading: true,
    contacts: [],
    dateRange: { earliestDate: new Date(), latestDate: new Date() },
  });

  useEffect(() => {
    const fetchGlobalContext = async () => {
      const [datesDataList, contacts]: [
        EarliestAndLatestDateResults,
        IContactData[]
      ] = await Promise.all([
        ipcRenderer.invoke('query-earliest-and-latest-dates'),
        ipcRenderer.invoke('query-get-contact-options'),
      ]);

      let earliestDate = new Date();
      let latestDate = new Date();
      if (datesDataList && datesDataList.length === 1) {
        earliestDate = new Date(datesDataList[0].earliest_date);
        latestDate = new Date(datesDataList[0].latest_date);
      }

      setGlobalData({
        isLoading: false,
        contacts,
        dateRange: {
          earliestDate,
          latestDate,
        },
      });
    };

    fetchGlobalContext();
  }, []);

  return (
    <div>
      <GlobalContext.Provider value={globalData}>
        <Navbar
          onRefresh={onRefresh}
          filters={filters}
          onUpdateFilters={setFilters}
        />

        <div style={{ padding: 48, paddingTop: 90 }}>
          <ChartTabs filters={filters} />
        </div>
        <Footer />
      </GlobalContext.Provider>
    </div>
  );
}
