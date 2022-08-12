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
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import {
  FiGitPullRequest,
  FiLifeBuoy,
  FiRefreshCw,
  FiSliders,
} from 'react-icons/fi';

import LogoWithText from '../../../assets/LogoWithText.svg';
import { APP_VERSION } from '../../constants/versions';
import { FilterPanel } from '../Filters/FilterPanel';
import { EmailModal } from '../Support/EmailModal';

export function Navbar({ onRefresh }: { onRefresh: () => void }) {
  const {
    isOpen: isEmailModalOpen,
    onOpen: onEmailModalOpen,
    onClose: onEmailModalClose,
  } = useDisclosure();

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
              >
                Adjust Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent style={{ width: '400px', marginRight: 16 }}>
              <PopoverArrow />
              <PopoverBody>
                <div style={{ padding: 16 }}>
                  <FilterPanel />
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
                }}
              >
                <Icon as={FiRefreshCw} style={{ marginRight: 12 }} />
                <Text size="sm" fontWeight={300}>
                  Refresh Data
                </Text>
              </MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={() => {
                  onEmailModalOpen();
                }}
              >
                <Icon as={FiLifeBuoy} style={{ marginRight: 12 }} />
                <Text size="sm" fontWeight={300}>
                  Contact Support
                </Text>
              </MenuItem>
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
