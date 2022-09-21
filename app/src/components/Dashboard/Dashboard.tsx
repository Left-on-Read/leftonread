import { useState } from 'react';

import { AnalyticsPage } from './AnalyticsPage';
import { SIDEBAR_WIDTH, SideNavbar, TPages } from './SideNavbar';

export function DashboardV2({ onRefresh }: { onRefresh: () => void }) {
  const [activePage, setActivePage] = useState<TPages>('Analytics');

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexWrap: 'nowrap',
      }}
    >
      <div style={{ width: `${SIDEBAR_WIDTH}px`, position: 'fixed' }}>
        <SideNavbar activePage={activePage} onSelectPage={setActivePage} />
      </div>
      <div style={{ width: `${SIDEBAR_WIDTH}px`, flexShrink: 0 }} />
      <div style={{ flex: '1 1 0', minWidth: 0 }}>
        {activePage === 'Analytics' && <AnalyticsPage onRefresh={onRefresh} />}
      </div>
    </div>
  );
}
