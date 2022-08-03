import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Button, Icon, Text } from '@chakra-ui/react';
import electron from 'electron';
import { FiFolder } from 'react-icons/fi';

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
            Grant Permissions
          </Text>
        </div>

        <Text
          fontSize={{ lg: 'md', xl: 'xl' }}
          color="gray.600"
          style={{ marginTop: 16 }}
        >
          {`
        In order for Left on Read to run, it requires Full Disk Access.
        `}
        </Text>

        <Text
          fontSize={{ lg: 'md', xl: 'xl' }}
          color="gray.600"
          style={{ padding: 24 }}
        >
          <ol>
            <li>{`Click the "Open System Preferences" button below`}</li>
            <li
              style={{ marginTop: 22 }}
            >{`Under "Full Disk Access", grant "Left on Read" access.`}</li>
            <li
              style={{ marginTop: 22 }}
            >{`Fully quit and restart the "Left on Read" app`}</li>
          </ol>
        </Text>
      </div>

      <Button
        style={{}}
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
        }}
        shadow="xl"
      >
        Open System Preferences
      </Button>
    </div>
  );
}
