import { SearchIcon, SettingsIcon } from '@chakra-ui/icons';
import { Button, IconButton } from '@chakra-ui/react';

import LogoWithText from '../../../assets/LogoWithText.svg';

export function Navbar() {
  return (
    <div
      style={{
        padding: '24px 48px',
        height: '90px',
        position: 'fixed',
        width: '100%',
        backgroundColor: 'white',
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
          <IconButton aria-label="Settings" icon={<SettingsIcon />} size="sm" />
        </div>
      </div>
    </div>
  );
}
