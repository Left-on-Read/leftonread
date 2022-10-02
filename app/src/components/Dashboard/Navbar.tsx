import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  theme as defaultTheme,
  useDisclosure,
} from '@chakra-ui/react';
import { SharedQueryFilters } from 'analysis/queries/filters/sharedQueryFilters';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import { FiRefreshCw, FiSliders } from 'react-icons/fi';

import { GroupChatFilters } from '../../constants/filters';
import { logEvent } from '../../utils/analytics';
import { FilterPanel } from '../Filters/FilterPanel';
import { useGlobalContext } from './GlobalContext';
import { SIDEBAR_WIDTH } from './SideNavbar';

export function Navbar({
  onRefresh,
  filters,
  onUpdateFilters,
}: {
  onRefresh: () => void;
  filters: SharedQueryFilters;
  onUpdateFilters: (arg0: SharedQueryFilters) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef: any = useRef();
  const { isLoading: isGlobalContextLoading } = useGlobalContext();

  let activeFilterCount = 0;
  if (filters.contact) {
    activeFilterCount += 1;
  }
  if (filters.groupChat === GroupChatFilters.BOTH) {
    activeFilterCount += 1;
  }
  if (filters.timeRange) {
    activeFilterCount += 1;
  }

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon mr={3} as={FiRefreshCw} />
                Refresh Left on Read
              </div>
            </AlertDialogHeader>

            <AlertDialogBody>
              This is only needed if you have more messages since the last time
              you refreshed. It will also reset your Left on Read Inbox tab and
              may take a few minutes to finish.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  logEvent({ eventName: 'REFRESH_DATA' });
                  onRefresh();
                }}
                ml={3}
              >
                Refresh
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <div
        style={{
          padding: `24px ${SIDEBAR_WIDTH + 66}px 24px 36px`,
          height: '90px',
          position: 'fixed',
          backgroundColor: 'white',
          zIndex: 8,
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <div>
            <Popover size="xl">
              <PopoverTrigger>
                <Button
                  size="md"
                  style={{ marginRight: 32 }}
                  leftIcon={<Icon as={FiSliders} />}
                  colorScheme="purple"
                  color="white"
                  onClick={() => {
                    logEvent({ eventName: 'ADJUST_FILTERS' });
                  }}
                  isLoading={isGlobalContextLoading}
                  loadingText="Filters"
                >
                  <Text>Adjust Filters</Text>
                  <AnimatePresence>
                    {activeFilterCount > 0 && (
                      <motion.div
                        key="filter-badge"
                        initial={{
                          height: 0,
                          width: 0,
                        }}
                        animate={{ height: 25, width: 25 }}
                        exit={{ height: 0, width: 0 }}
                        style={{
                          position: 'absolute',
                          backgroundColor: defaultTheme.colors.red['400'],
                          borderRadius: '50%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          top: -10,
                          right: -10,
                        }}
                        transition={{
                          type: 'spring',
                          duration: 0.2,
                        }}
                      >
                        <Text fontSize={16}>{activeFilterCount}</Text>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </PopoverTrigger>
              <PopoverContent style={{ width: '400px', marginRight: 16 }}>
                <PopoverArrow />
                <PopoverBody>
                  <div style={{ padding: 10 }}>
                    <FilterPanel
                      filters={filters}
                      onUpdateFilters={onUpdateFilters}
                    />
                  </div>
                </PopoverBody>
              </PopoverContent>
            </Popover>

            <Button
              leftIcon={<Icon as={FiRefreshCw} />}
              onClick={() => {
                onOpen();
                logEvent({ eventName: 'OPEN_MODAL_REFRESH_DATA' });
              }}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
