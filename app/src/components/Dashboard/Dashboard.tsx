import { SharedQueryFilters } from 'analysis/queries/filters/sharedQueryFilters';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';

import { EarliestAndLatestDateResults } from '../../analysis/queries/EarliestAndLatestDatesQuery';
import { DEFAULT_QUERY_FILTERS } from '../Filters/FilterPanel';
import { Footer } from '../Footer';
import { ChartTabs } from './ChartTabs';
import { Navbar } from './Navbar';

export function Dashboard({ onRefresh }: { onRefresh: () => void }) {
  const [filters, setFilters] = useState<SharedQueryFilters>(
    DEFAULT_QUERY_FILTERS
  );
  const [earliestAndLatestDate, setEarliestAndLatestDates] = useState<{
    earliestDate: Date;
    latestDate: Date;
  }>();

  // TODO(Danilowicz): Possibly move this to electron-store?
  useEffect(() => {
    async function fetchEarliestAndLatestDates() {
      try {
        const datesDataList: EarliestAndLatestDateResults =
          await ipcRenderer.invoke('query-earliest-and-latest-dates');
        if (datesDataList && datesDataList.length === 1) {
          const earlyDate = datesDataList[0].earliest_date;
          const lateDate = datesDataList[0].latest_date;
          setEarliestAndLatestDates({
            earliestDate: new Date(earlyDate),
            latestDate: new Date(lateDate),
          });
        }
      } catch (err) {
        log.error(`ERROR: fetching for fetchEarliestAndLatestDates`, err);
      }
    }
    fetchEarliestAndLatestDates();
  }, []);

  return (
    <div>
      <Navbar
        onRefresh={onRefresh}
        filters={filters}
        onUpdateFilters={setFilters}
        earliestAndLatestDate={earliestAndLatestDate}
      />

      <div style={{ padding: 48, paddingTop: 90 }}>
        <ChartTabs
          filters={filters}
          earliestAndLatestDate={earliestAndLatestDate}
        />
      </div>
      <Footer />
    </div>
  );
}
