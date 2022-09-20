import { useState } from 'react';

import { Dashboard } from './Dashboard';
import { SideNavbar, TPages } from './SideNavbar';

export function DashboardV2({ onRefresh }: { onRefresh: () => void }) {
  const [activePage, setActivePage] = useState<TPages>('Productivity');

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex' }}>
      <SideNavbar activePage={activePage} onSelectPage={setActivePage} />

      <div style={{ paddingLeft: 200 }}>
        <Dashboard onRefresh={onRefresh} />
      </div>
    </div>
  );
}
