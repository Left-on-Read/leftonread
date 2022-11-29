import {
  Box,
  Button,
  Icon,
  Stack,
  Text,
  theme as defaultTheme,
  useDisclosure,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import { IconType } from 'react-icons';
import { BsLightningCharge } from 'react-icons/bs';
import { FiClipboard, FiGift, FiInbox } from 'react-icons/fi';

import LogoWithText from '../../../assets/LogoWithText.svg';
import { APP_VERSION } from '../../constants/versions';
import { logEvent } from '../../utils/analytics';
import { useGoldContext } from '../Premium/GoldContext';
import { PremiumModal } from '../Premium/PremiumModal';
import { EmailModal } from '../Support/EmailModal';

const Pages = ['Wrapped', 'Analytics', 'Productivity', 'Settings'] as const;

export const SIDEBAR_WIDTH = 200;

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
      className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
      onClick={() => {
        logEvent({
          eventName: 'CLICKED_SIDE_NAV',
          properties: {
            tab: text,
          },
        });
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
  const { isPremium, setPremium } = useGoldContext();
  const {
    isOpen: isPremiumModalOpen,
    onClose: onClosePremiumModal,
    onOpen: onOpenPremiumModal,
  } = useDisclosure();
  const {
    isOpen: isEmailModalOpen,
    onClose: onCloseEmailModal,
    onOpen: onOpenEmailModal,
  } = useDisclosure();

  return (
    <div
      style={{
        height: '100vh',
        borderRight: '1px solid gray',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
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
            {Pages.filter((page) => page !== 'Settings').map((page) => {
              let icon = BsLightningCharge;
              if (page === 'Productivity') {
                icon = FiClipboard;
              }
              if (page === 'Wrapped') {
                icon = FiGift;
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
          {!isPremium && (
            <Button
              variant="link"
              fontSize="md"
              colorScheme="yellow"
              onClick={onOpenPremiumModal}
              fontWeight="semibold"
            >
              Unlock Gold
            </Button>
          )}
          <Button
            variant="link"
            fontSize="md"
            onClick={() => {
              onSelectPage('Settings');
            }}
          >
            Settings
          </Button>
          <Button
            variant="link"
            fontSize="md"
            onClick={() => {
              onOpenEmailModal();
            }}
          >
            Contact Support
          </Button>
          {!isPremium && process.env.NODE_ENV === 'development' && (
            <Button
              onClick={() => {
                ipcRenderer.invoke('dev-activate-license');
                setPremium(true);
              }}
              variant="link"
              fontSize="md"
              colorScheme="red"
            >
              Dev: Gold On
            </Button>
          )}
          {isPremium && process.env.NODE_ENV === 'development' && (
            <Button
              onClick={() => {
                ipcRenderer.invoke('deactivate-license');
                setPremium(false);
              }}
              variant="link"
              fontSize="md"
              colorScheme="red"
            >
              Dev: Gold Off
            </Button>
          )}
        </Stack>

        <div style={{ marginTop: '15%' }}>
          <Text fontSize="sm" color={defaultTheme.colors.gray['500']}>
            Left on Read v{APP_VERSION}
          </Text>
        </div>
      </div>
      <PremiumModal isOpen={isPremiumModalOpen} onClose={onClosePremiumModal} />
      <EmailModal isOpen={isEmailModalOpen} onClose={onCloseEmailModal} />
    </div>
  );
}
