import { SharedQueryFilters } from 'analysis/queries/filters/sharedQueryFilters';
import { useState } from 'react';

import { DEFAULT_QUERY_FILTERS } from '../Filters/FilterPanel';
import { Footer } from '../Footer';
import { ChartTabs } from './ChartTabs';
import { Navbar } from './Navbar';

export function Dashboard({ onRefresh }: { onRefresh: () => void }) {
  const [filters, setFilters] = useState<SharedQueryFilters>(
    DEFAULT_QUERY_FILTERS
  );

  return (
    <div>
      <Navbar
        onRefresh={onRefresh}
        filters={filters}
        onUpdateFilters={setFilters}
      />

      <div style={{ padding: 48, paddingTop: 90 }}>
        <ChartTabs filters={filters} />
      </div>
      <Footer />
    </div>
  );
}
