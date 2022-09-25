import { Box } from '@chakra-ui/react';
import Store from 'electron-store';
import { useState } from 'react';

import { SettingsPage } from '../Pages/SettingsPage';
import { GoldContext } from '../Premium/GoldContext';
import { AnalyticsPage } from './AnalyticsPage';
import { EngagementCharts } from './ChartTabs';
import { MessageInbox } from './MessageInbox';
import { SIDEBAR_WIDTH, SideNavbar, TPages } from './SideNavbar';

const store = new Store();

export function Dashboard({ onRefresh }: { onRefresh: () => void }) {
  const [activePage, setActivePage] = useState<TPages>('Inbox');
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
          {activePage === 'Productivity' && (
            // TODO(Danilowicz): Should make a shared container
            <Box style={{ padding: '70px 50px 50px 50px' }}>
              <EngagementCharts />
            </Box>
          )}
          {activePage === 'Inbox' && (
            // TODO(Danilowicz): Should make a shared container
            <Box style={{ padding: '70px 50px 50px 50px' }}>
              <MessageInbox />
            </Box>
          )}
          {activePage === 'Settings' && <SettingsPage />}
        </div>
      </div>
    </GoldContext.Provider>
  );
}
