import Store from 'electron-store';
import { useState } from 'react';

import { SettingsPage } from '../Pages/SettingsPage';
import { GoldContext } from '../Premium/GoldContext';
import { AnalyticsPage } from './AnalyticsPage';
import { SIDEBAR_WIDTH, SideNavbar, TPages } from './SideNavbar';

const store = new Store();

export function DashboardV2({ onRefresh }: { onRefresh: () => void }) {
  const [activePage, setActivePage] = useState<TPages>('Analytics');
  const [isPremium, setIsPremium] = useState<boolean>(
    store.get('license') !== ''
  );

  return (
    <GoldContext.Provider
      value={{
        isPremium,
        setPremium: (value: boolean) => {
          setIsPremium(value);
        },
      }}
    >
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
          {activePage === 'Analytics' && (
            <AnalyticsPage onRefresh={onRefresh} />
          )}
          {activePage === 'Settings' && <SettingsPage />}
        </div>
      </div>
    </GoldContext.Provider>
  );
}
