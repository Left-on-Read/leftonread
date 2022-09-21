import { useState } from 'react';

import { AnalyticsPage } from './AnalyticsPage';
import { SideNavbar, TPages } from './SideNavbar';

export function DashboardV2({ onRefresh }: { onRefresh: () => void }) {
  const [activePage, setActivePage] = useState<TPages>('Analytics');

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <SideNavbar activePage={activePage} onSelectPage={setActivePage} />
      <div style={{ width: 200 }} />
      <div style={{ flexGrow: 1 }}>
        {activePage === 'Analytics' && <AnalyticsPage onRefresh={onRefresh} />}
      </div>
    </div>
  );
}
