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
import { SharedQueryFilters } from 'analysis/queries/filters/sharedQueryFilters';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

import { logEvent } from '../../utils/analytics';
import { DEFAULT_QUERY_FILTERS } from '../Filters/FilterPanel';
import { Footer } from '../Footer';
import { ChartTabs } from './ChartTabs';
import { Navbar } from './Navbar';

export function AnalyticsPage({ onRefresh }: { onRefresh: () => void }) {
  const [filters, setFilters] = useState<SharedQueryFilters>(
    DEFAULT_QUERY_FILTERS
  );

  const [doesRequireRefresh, setDoesRequireRefresh] = useState<boolean>(false);
  const [showUpdateAvailable, setShowUpdateAvailable] =
    useState<boolean>(false);

  const cancelRef = useRef<any>();

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

  useEffect(() => {
    logEvent({
      eventName: 'LOADED_DASHBOARD',
    });
  }, []);

  useEffect(() => {
    ipcRenderer.send('listen-to-updates');

    ipcRenderer.on('update-available', () => {
      setShowUpdateAvailable(true);
    });
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ width: 'inherit' }}>
        <Navbar
          onRefresh={onRefresh}
          filters={filters}
          onUpdateFilters={setFilters}
        />

        <div style={{ paddingTop: 90 }}>
          <ChartTabs filters={filters} />
        </div>
      </div>
      <Footer />
      <AlertDialog
        isOpen={doesRequireRefresh && !showUpdateAvailable}
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
            {`We've added exciting new features that require a data refresh!`}
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
      <AlertDialog
        isOpen={showUpdateAvailable}
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
              Update Available
            </div>
          </AlertDialogHeader>
          <AlertDialogBody>
            Restart to install new features, stability improvements, and overall
            updates.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              colorScheme="purple"
              onClick={() => {
                ipcRenderer.invoke('quit-and-install');
              }}
              style={{ marginRight: 16 }}
            >
              Restart
            </Button>
            <Button
              onClick={() => {
                setDoesRequireRefresh(false);
                onRefresh();
              }}
            >
              Dismiss
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
