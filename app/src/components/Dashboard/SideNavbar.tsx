import {
  Box,
  Button,
  Icon,
  Stack,
  Text,
  theme as defaultTheme,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { BsLightningCharge } from 'react-icons/bs';
import { FiBarChart, FiClipboard, FiCoffee } from 'react-icons/fi';

import LogoWithText from '../../../assets/LogoWithText.svg';
import { APP_VERSION } from '../../constants/versions';

const Pages = ['Analytics'] as const;

// TODO(ALEX): PRODUCTIVITY
// const Pages = ['Productivity', 'Analytics'] as const;

export type TPages = typeof Pages[number];

function SidebarMainLink({
  text,
  icon,
  isActive,
  onSelect,
}: {
  text: string;
  icon: IconType;
  isActive?: boolean;
  onSelect: () => void;
}) {
  return (
    <Box
      as="button"
      className="sidebar-link"
      style={{
        padding: '12px 26px',
        cursor: 'pointer',
        width: '100%',
        display: 'flex',
        alignItems: 'center',

        ...(isActive && {
          borderLeft: `5px solid ${defaultTheme.colors.purple['400']}`,
          backgroundColor: defaultTheme.colors.purple['100'],
          padding: '12px 16px 12px 21px',
        }),
      }}
      onClick={() => {
        onSelect();
      }}
    >
      <Icon as={icon} style={{ marginRight: 8, marginBottom: 3 }} />
      <Text
        fontSize="lg"
        fontWeight="semibold"
        style={{ textAlign: 'left', verticalAlign: 'center' }}
      >
        {text}
      </Text>
    </Box>
  );
}

export function SideNavbar({
  activePage,
  onSelectPage,
}: {
  activePage: TPages;
  onSelectPage: (page: TPages) => void;
}) {
  return (
    <div
      style={{
        width: 200,
        height: '100vh',
        borderRight: '1px solid gray',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'fixed',
      }}
    >
      <div>
        <div>
          <div style={{ padding: '18px' }}>
            <img
              src={LogoWithText}
              alt="Left on Read"
              style={{ height: '100%' }}
            />
          </div>
        </div>
        <div style={{ marginTop: '25%' }}>
          <Stack direction="column" alignItems="flex-start">
            {Pages.map((page) => {
              let icon = BsLightningCharge;

              if (page === 'Analytics') {
                icon = FiBarChart;
              } else if (page === 'Reports') {
                icon = FiClipboard;
              }

              return (
                <SidebarMainLink
                  key={page}
                  text={page}
                  icon={icon}
                  isActive={activePage === page}
                  onSelect={() => {
                    onSelectPage(page);
                  }}
                />
              );
            })}
          </Stack>
        </div>
      </div>
      <div
        style={{
          backgroundColor: defaultTheme.colors.gray['200'],
          padding: '26px',
        }}
      >
        <Stack
          direction="column"
          style={{ alignItems: 'flex-start', marginTop: '22px' }}
          spacing="12px"
        >
          <Button variant="link" fontSize="md">
            Settings
          </Button>
          <Button variant="link" fontSize="md">
            Feedback
          </Button>
        </Stack>

        <div style={{ marginTop: '15%' }}>
          <Text fontSize="sm" color={defaultTheme.colors.gray['500']}>
            Left on Read v{APP_VERSION}
          </Text>
        </div>
      </div>
    </div>
  );
}
