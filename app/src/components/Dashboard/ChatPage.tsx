import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Icon,
  Input,
  Text,
  theme as defaultTheme,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { IoChatbubblesOutline } from 'react-icons/io5';

import { logEvent } from '../../utils/analytics';
import { Footer } from '../Footer';
import { ChatInterface } from './ChatInterface';

export function ChatPage({ onRefresh }: { onRefresh: () => void }) {
  const [doesRequireRefresh, setDoesRequireRefresh] = useState<boolean>(false);
  const [showUpdateAvailable, setShowUpdateAvailable] =
    useState<boolean>(false);

  const [openAIKey, setOpenAIKey] = useState<string>('');

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpenAIKey(e.target.value);
  };

  const cancelRef = useRef<any>();

  useEffect(() => {
    const checkRequiresRefresh = async () => {
      let requiresRefresh = false;
      try {
        requiresRefresh = await ipcRenderer.invoke('check-requires-refresh');
      } catch (e) {
        log.error(e);
      }

      if (requiresRefresh) {
        setDoesRequireRefresh(requiresRefresh);
      }
    };

    checkRequiresRefresh();
  }, []);

  useEffect(() => {
    logEvent({
      eventName: 'LOADED_DASHBOARD',
    });
  }, []);

  useEffect(() => {
    ipcRenderer.send('listen-to-updates');

    ipcRenderer.on('update-available', () => {
      setShowUpdateAvailable(true);
    });
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',

          padding: '24px 24px 0px 24px',
        }}
      >
        <div
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
              as={IoChatbubblesOutline}
              color="gray.500"
              style={{ width: '80%', height: '80%' }}
            />
          </Box>
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text fontSize="lg" fontWeight={600}>
                LLM Chat
              </Text>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginRight: false ? '25px' : undefined,
              }}
            >
              <Text fontSize="sm" color="gray">
                Ask a chatbot questions about your iMessages
              </Text>
            </div>
          </div>
        </div>
        <Input
          value={openAIKey}
          onChange={handleKeyChange}
          placeholder="Add OpenAI API key..."
          mr={2}
          width="fit"
        />
      </div>

      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          height: 'inherit',
        }}
      >
        <ChatInterface openAIKey={openAIKey} />

        <Footer />
      </div>
      <AlertDialog
        isOpen={doesRequireRefresh && !showUpdateAvailable}
        onClose={() => {}}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Icon
                as={FiAlertCircle}
                style={{ marginRight: 8 }}
                color="red.400"
              />{' '}
              Requires Refresh
            </div>
          </AlertDialogHeader>
          <AlertDialogBody>
            {`We've added exciting new features that require a data refresh!`}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              colorScheme="purple"
              onClick={() => {
                setDoesRequireRefresh(false);
                onRefresh();
              }}
            >
              Refresh
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        isOpen={showUpdateAvailable}
        onClose={() => {}}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Icon
                as={FiAlertCircle}
                style={{ marginRight: 8 }}
                color="red.400"
              />{' '}
              Update Available
            </div>
          </AlertDialogHeader>
          <AlertDialogBody>
            Restart to install new features, stability improvements, and overall
            updates.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              colorScheme="purple"
              onClick={() => {
                ipcRenderer.invoke('quit-and-install');
              }}
              style={{ marginRight: 16 }}
            >
              Restart
            </Button>
            <Button
              onClick={() => {
                setDoesRequireRefresh(false);
                onRefresh();
              }}
            >
              Dismiss
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
