import { SearchIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  Button,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { FiLifeBuoy } from 'react-icons/fi';

import LogoWithText from '../../../assets/LogoWithText.svg';
import { EmailModal } from '../Support/EmailModal';

export function Navbar() {
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
        zIndex: 2,
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
          <Button
            size="sm"
            style={{ marginRight: 16 }}
            leftIcon={<SearchIcon />}
            colorScheme="purple"
          >
            Adjust Filters (0)
          </Button>
          <Menu>
            <MenuButton as={IconButton} icon={<SettingsIcon />} size="sm" />
            <MenuList>
              <MenuItem onClick={() => onEmailModalOpen()}>
                <Icon as={FiLifeBuoy} style={{ marginRight: 12 }} />
                <Text size="sm" fontWeight={300}>
                  Contact Support
                </Text>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
      <EmailModal isOpen={isEmailModalOpen} onClose={onEmailModalClose} />
    </div>
  );
}
