import {
  Box,
  Button,
  Checkbox,
  Icon,
  Stack,
  Text,
  theme as defaultTheme,
  useDisclosure,
  Wrap,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { FiBell, FiMail, FiTrash2 } from 'react-icons/fi';

import { NotificationSettings } from '../../constants/types';
import { logEvent } from '../../utils/analytics';
import { STRIPE_LINK } from '../Premium/constants';
import { useGoldContext } from '../Premium/GoldContext';
import { EmailModal } from '../Support/EmailModal';

function Notifications() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notifSettings, setNotifSettings] =
    useState<NotificationSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      const settings = await ipcRenderer.invoke('get-notification-settings');
      setNotifSettings(settings);
      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  return (
    <Box>
      <Checkbox
        size="lg"
        colorScheme="purple"
        onChange={(event) => {
          const newNotifSettings = {
            ...notifSettings,
            responseRemindersEnabled: event.target.checked,
          };

          setNotifSettings(newNotifSettings);
          ipcRenderer.invoke('set-notification-settings', newNotifSettings);
        }}
        disabled={isLoading}
        isChecked={notifSettings?.responseRemindersEnabled}
      >
        Response Reminders
      </Checkbox>
    </Box>
  );
}

function Application() {
  return (
    <Box>
      <Button colorScheme="red">Reset Application</Button>
    </Box>
  );
}

function ContactUs() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [defaultReason, setDefaultReason] = useState<string>('');

  const handleOpenEmailModal = (reason: string) => {
    setDefaultReason(reason);

    // HACK(teddy): Bad code design, but whatevs. onOpen should take the reason.
    setTimeout(() => {
      onOpen();
    }, 50);
  };

  return (
    <Box>
      <Stack style={{ alignItems: 'flex-start' }}>
        <Button
          variant="link"
          colorScheme="purple"
          onClick={() => {
            handleOpenEmailModal('feature_request');
          }}
        >
          Submit Feedback
        </Button>
        <Button
          variant="link"
          colorScheme="purple"
          onClick={() => {
            handleOpenEmailModal('support');
          }}
        >
          Submit a Bug
        </Button>
        <Button
          variant="link"
          colorScheme="purple"
          onClick={() => {
            handleOpenEmailModal('other');
          }}
        >
          Email Us
        </Button>
      </Stack>
      <EmailModal
        isOpen={isOpen}
        onClose={onClose}
        defaultReason={defaultReason}
      />
    </Box>
  );
}

function ManageSubscription() {
  const { isPremium } = useGoldContext();
  return (
    <Box>
      {isPremium && (
        <Button
          variant="link"
          onClick={() => {
            logEvent({
              eventName: 'EDIT_GOLD_SETTINGS',
            });
            window.open(
              'https://billing.stripe.com/p/login/eVabK06mUcNG2oE6oo'
            );
          }}
        >
          Edit Subscription
        </Button>
      )}
      {!isPremium && (
        <Button
          colorScheme="yellow"
          onClick={() => {
            logEvent({
              eventName: 'UNLOCK_GOLD_SETTINGS',
            });
            window.open(STRIPE_LINK);
          }}
        >
          Get Left on Read Gold
        </Button>
      )}
    </Box>
  );
}

function SettingsCard({
  children,
  icon,
  title,
  description,
}: {
  children: React.ReactNode;
  icon: IconType;
  title: string;
  description: string;
}) {
  return (
    <Box
      bg="gray.100"
      style={{
        borderRadius: 16,
        width: '45%',
        padding: '24px 40px',
      }}
    >
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          style={{
            marginRight: 12,
            border: `1px ${defaultTheme.colors.gray['500']} solid`,
            borderRadius: '50%',
            padding: 8,
            width: 40,
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          boxShadow="lg"
        >
          <Icon
            as={icon}
            color="gray.500"
            style={{ width: '80%', height: '80%' }}
          />
        </Box>
        <Box>
          <Text fontWeight="bold" fontSize="xl">
            {title}
          </Text>
          <Text fontWeight="light" fontSize="sm" color="gray.600">
            {description}
          </Text>
        </Box>
      </Box>
      <Box style={{ padding: 24 }}>{children}</Box>
    </Box>
  );
}

export function SettingsPage() {
  return (
    <Box style={{ padding: '36px' }}>
      <Text fontSize="5xl" fontWeight="bold" style={{ marginBottom: 40 }}>
        Settings
      </Text>

      <Wrap gap={6} spacing={30}>
        <SettingsCard
          title="Notifications"
          icon={FiBell}
          description="Enable and disable notifications"
        >
          <Notifications />
        </SettingsCard>
        <SettingsCard
          title="Reset Application"
          icon={FiTrash2}
          description="Clears existing analytics."
        >
          <Application />
        </SettingsCard>
        <SettingsCard
          title="Contact Us"
          icon={FiMail}
          description="Questions or Feedback?"
        >
          <ContactUs />
        </SettingsCard>
        <SettingsCard
          title="Manage Subscription"
          icon={FiMail}
          description="Re-new, edit, or cancel Left on Read Gold"
        >
          <ManageSubscription />
        </SettingsCard>
      </Wrap>
    </Box>
  );
}
