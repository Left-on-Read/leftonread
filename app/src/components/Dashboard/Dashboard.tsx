import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
} from '@chakra-ui/react';
import { EarliestAndLatestDateResults } from 'analysis/queries/EarliestAndLatestDatesQuery';
import { SharedQueryFilters } from 'analysis/queries/filters/sharedQueryFilters';
import { IContactData } from 'components/Filters/ContactFilter';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

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

  const [doesRequireRefresh, setDoesRequireRefresh] = useState<boolean>(true);
  const cancelRef = useRef<any>();

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

  useEffect(() => {
    const checkRequiresRefresh = async () => {
      let requiresRefresh = false;
      try {
        requiresRefresh = await ipcRenderer.invoke('check-requires-refresh');
      } catch (e) {
        log.error(e);
      }

      if (requiresRefresh) {
        setDoesRequireRefresh(requiresRefresh);
      }
    };

    checkRequiresRefresh();
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
        <AlertDialog
          isOpen={doesRequireRefresh}
          onClose={() => {}}
          leastDestructiveRef={cancelRef}
        >
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon
                  as={FiAlertCircle}
                  style={{ marginRight: 8 }}
                  color="red.400"
                />{' '}
                Requires Refresh
              </div>
            </AlertDialogHeader>
            <AlertDialogBody>
              {`We've added exciting new features that require a data refresh.`}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                colorScheme="purple"
                onClick={() => {
                  setDoesRequireRefresh(false);
                  onRefresh();
                }}
              >
                Refresh
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </GlobalContext.Provider>
    </div>
  );
}
