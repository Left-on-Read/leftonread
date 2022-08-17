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
  useDisclosure,
} from '@chakra-ui/react';
import { SharedQueryFilters } from 'analysis/queries/filters/sharedQueryFilters';
import { IContactData } from 'components/Filters/ContactFilter';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import {
  FiGitPullRequest,
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

export function Navbar({
  onRefresh,
  filters,
  onUpdateFilters,
  earliestAndLatestDate,
}: {
  onRefresh: () => void;
  filters: SharedQueryFilters;
  onUpdateFilters: (arg0: SharedQueryFilters) => void;
  earliestAndLatestDate?: {
    earliestDate: Date;
    latestDate: Date;
  };
}) {
  const navigate = useNavigate();
  const {
    isOpen: isEmailModalOpen,
    onOpen: onEmailModalOpen,
    onClose: onEmailModalClose,
  } = useDisclosure();

  const [allContacts, setAllContacts] = useState<IContactData[]>([]);

  useEffect(() => {
    async function getContacts() {
      try {
        const contacts: IContactData[] = await ipcRenderer.invoke(
          'query-get-contact-options'
        );
        setAllContacts(contacts);
      } catch (err) {
        log.error('ERROR: fetching contact options', err);
      }
    }
    getContacts();
  }, []);

  let activeFilterCount = 0;
  if (filters.contact) {
    activeFilterCount += 1;
  }
  if (filters.groupChat === GroupChatFilters.BOTH) {
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
        zIndex: 4,
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
                size="sm"
                style={{ marginRight: 16 }}
                leftIcon={<Icon as={FiSliders} />}
                // bg="purple.400"
                // color="white"
                onClick={() => {
                  logEvent({ eventName: 'ADJUST_FILTERS' });
                }}
              >
                Adjust Filters
                {activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </Button>
            </PopoverTrigger>
            <PopoverContent style={{ width: '400px', marginRight: 16 }}>
              <PopoverArrow />
              <PopoverBody>
                <div style={{ padding: 10 }}>
                  <FilterPanel
                    contacts={allContacts}
                    filters={filters}
                    onUpdateFilters={onUpdateFilters}
                    earliestAndLatestDate={earliestAndLatestDate}
                  />
                </div>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <Menu>
            <MenuButton as={IconButton} icon={<SettingsIcon />} size="sm" />
            <MenuList>
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
