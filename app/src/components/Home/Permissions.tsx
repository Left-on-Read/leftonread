import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Button, Icon, Text } from '@chakra-ui/react';
import electron from 'electron';
import { FiFolder } from 'react-icons/fi';

import { logEvent } from '../../utils/analytics';

export function Permissions() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Icon
            as={FiFolder}
            color="blue.400"
            w={{ lg: 6, xl: 7 }}
            h={{ lg: 6, xl: 7 }}
            style={{ marginRight: '8px' }}
          />
          <Text
            color="black"
            fontWeight="bold"
            fontSize={{ lg: 'xl', xl: '3xl' }}
          >
            Give Access
          </Text>
        </div>

        <Text
          fontSize={{ lg: 'md', xl: 'xl' }}
          color="gray.600"
          style={{ marginTop: 16 }}
        >
          {`
        Like other applications, Left on Read requires access to your files.
        `}
        </Text>

        <Text
          fontSize={{ lg: 'md', xl: 'xl' }}
          color="gray.600"
          style={{ padding: 24 }}
        >
          <ol>
            <li> Open System Preferences below.</li>
            <li style={{ marginTop: 22 }}>
              Under Full Disk Access, grant Left on Read access.{' '}
              <span style={{ fontWeight: 600 }}>
                If you {`don't`} see Left on Read, add the app with the {`"+"`}{' '}
                button.
              </span>
            </li>
            <li style={{ marginTop: 22 }}>
              Fully quit and restart the Left on Read app. If that did not work,
              you may have to restart your computer.
            </li>
          </ol>
        </Text>
      </div>

      <Button
        rightIcon={<ArrowForwardIcon />}
        colorScheme="purple"
        onClick={async () => {
          const api = new Proxy(electron, {
            get: (target: any, property: any) =>
              target[property] ||
              (target.remote ? target.remote[property] : undefined),
          });

          if (process.platform === 'darwin') {
            await api.shell.openExternal(
              `x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles`
            );
          }
          logEvent({ eventName: 'OPEN_SYSTEM_PREFERENCES' });
        }}
        shadow="xl"
      >
        Open System Preferences
      </Button>
    </div>
  );
}
