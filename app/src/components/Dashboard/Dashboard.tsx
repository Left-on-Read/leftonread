import { Box, Stack } from '@chakra-ui/react';
import { ContactOptionsQueryResult } from 'analysis/queries/ContactOptionsQuery';
import { EarliestAndLatestDateResults } from 'analysis/queries/EarliestAndLatestDatesQuery';
import { ipcRenderer } from 'electron';
import Store from 'electron-store';
import { useEffect, useState } from 'react';

import { RespondReminders } from '../Graphs/RespondReminders';
import { SettingsPage } from '../Pages/SettingsPage';
import { GoldContext } from '../Premium/GoldContext';
import { MessageScheduler } from '../Productivity/MessageScheduler';
import { AnalyticsPage } from './AnalyticsPage';
import { GlobalContext, TGlobalContext } from './GlobalContext';
import { SIDEBAR_WIDTH, SideNavbar, TPages } from './SideNavbar';
import { WrappedPage } from './Wrapped/WrappedPage';

const store = new Store();

export function Dashboard({ onRefresh }: { onRefresh: () => void }) {
  const [activePage, setActivePage] = useState<TPages>('Wrapped');
  const [isPremium, setIsPremium] = useState<boolean>(
    store.get('license') !== ''
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
        ContactOptionsQueryResult[]
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
    <GlobalContext.Provider value={globalData}>
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
              <Box style={{ padding: '70px 36px 36px 36px' }}>
                <Stack direction="column" spacing={40}>
                  <RespondReminders />
                  <MessageScheduler />
                </Stack>
              </Box>
            )}
            {activePage === 'Settings' && <SettingsPage />}
            {activePage === 'Wrapped' && <WrappedPage />}
          </div>
        </div>
      </GoldContext.Provider>
    </GlobalContext.Provider>
  );
}
