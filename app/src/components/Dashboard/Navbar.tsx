import { SettingsIcon } from '@chakra-ui/icons';
import {
  Button,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
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
import { ipcRenderer } from 'electron';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiGitPullRequest,
  FiLock,
  FiRefreshCw,
  FiSlash,
  FiSliders,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import LogoWithText from '../../../assets/LogoWithText.svg';
import { GroupChatFilters } from '../../constants/filters';
import { APP_VERSION } from '../../constants/versions';
import { logEvent } from '../../utils/analytics';
import { FilterPanel } from '../Filters/FilterPanel';
import { EmailModal } from '../Support/EmailModal';
import { useGlobalContext } from './GlobalContext';

export function Navbar({
  onRefresh,
  filters,
  onUpdateFilters,
}: {
  onRefresh: () => void;
  filters: SharedQueryFilters;
  onUpdateFilters: (arg0: SharedQueryFilters) => void;
}) {
  const { isLoading: isGlobalContextLoading, isPremium } = useGlobalContext();
  const navigate = useNavigate();
  const {
    isOpen: isEmailModalOpen,
    onOpen: onEmailModalOpen,
    onClose: onEmailModalClose,
  } = useDisclosure();

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
    <div
      style={{
        padding: '24px 48px',
        height: '90px',
        position: 'fixed',
        width: '100%',
        backgroundColor: 'white',
        zIndex: 8,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <img src={LogoWithText} alt="Left on Read" style={{ height: '100%' }} />
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

          <Menu>
            <MenuButton as={IconButton} icon={<SettingsIcon />} size="md" />
            <MenuList>
              {!isPremium && (
                <MenuItem
                  onClick={() => {
                    onRefresh();
                    logEvent({ eventName: 'UNLOCK_PREMIUM' });
                  }}
                >
                  <Icon
                    as={FiLock}
                    style={{ marginRight: 12 }}
                    color="yellow.500"
                  />
                  <Text size="sm" fontWeight={500} color="yellow.500">
                    Unlock Premium
                  </Text>
                </MenuItem>
              )}
              {isPremium && process.env.NODE_ENV === 'development' && (
                <MenuItem
                  onClick={() => {
                    ipcRenderer.invoke('deactivate-license');
                  }}
                >
                  <Icon
                    as={FiLock}
                    style={{ marginRight: 12 }}
                    color="yellow.500"
                  />
                  <Text size="sm" fontWeight={500} color="yellow.500">
                    Deactivate License
                  </Text>
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  onRefresh();
                  logEvent({ eventName: 'REFRESH_DATA' });
                }}
              >
                <Icon as={FiRefreshCw} style={{ marginRight: 12 }} />
                <Text size="sm" fontWeight={300}>
                  Refresh Data
                </Text>
              </MenuItem>
              <MenuDivider />
              {/* <MenuItem
                onClick={() => {
                  onEmailModalOpen();
                }}
              >
                <Icon as={FiLifeBuoy} style={{ marginRight: 12 }} />
                <Text size="sm" fontWeight={300}>
                  Contact Support
                </Text>
              </MenuItem> */}
              <MenuItem
                onClick={() => {
                  onEmailModalOpen();
                }}
              >
                <Icon as={FiGitPullRequest} style={{ marginRight: 12 }} />
                <Text size="sm" fontWeight={300}>
                  Feedback
                </Text>
              </MenuItem>
              <MenuItem
                onClick={async () => {
                  logEvent({ eventName: 'RESET_APPLICATION_DATA ' });
                  await ipcRenderer.invoke('reset-application-data');
                  navigate('/start');
                }}
              >
                <Icon as={FiSlash} style={{ marginRight: 12 }} />
                <Text size="sm" fontWeight={300}>
                  Reset Application
                </Text>
              </MenuItem>
              <div
                style={{
                  padding: '0px 16px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 10,
                }}
              >
                <Text color="gray.400" fontSize={12}>
                  Left on Read {APP_VERSION}
                </Text>
              </div>
            </MenuList>
          </Menu>
        </div>
      </div>
      <EmailModal isOpen={isEmailModalOpen} onClose={onEmailModalClose} />
    </div>
  );
}
