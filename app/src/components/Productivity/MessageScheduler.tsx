import {
  Box,
  Button,
  Icon,
  Stack,
  Text,
  theme as defaultTheme,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiWatch } from 'react-icons/fi';

import { ScheduledMessage } from '../../constants/types';
import { logEvent } from '../../utils/analytics';
import { GraphContainer } from '../Graphs/GraphContainer';
import { MessageSchedulerModal } from './MessageSchedulerModal';

function MessageCard({
  message,
  refresh,
}: {
  message: ScheduledMessage;
  refresh: () => void;
}) {
  const missedSend = message.sendDate < new Date();

  const sendMessage = async () => {
    await ipcRenderer.invoke('send-message', message);
    logEvent({
      eventName: 'SEND_NOW_SCHEDULED_MESSAGE',
    });
    refresh();
  };

  const cancelMessage = async () => {
    await ipcRenderer.invoke('delete-scheduled-message', message.id);
    logEvent({
      eventName: 'CANCELLED_SCHEDULED_MESSAGE',
    });
    refresh();
  };

  return (
    <Box
      key={message.id}
      style={{
        border: `1px solid ${defaultTheme.colors.gray['200']}`,
        padding: 32,
        borderRadius: 16,
      }}
      shadow="xl"
    >
      {missedSend && (
        <Tooltip
          label="Most likely the app was closed when this message was scheduled to send."
          fontSize="md"
          placement="bottom"
          style={{ cursor: 'pointer' }}
        >
          <div
            style={{
              display: 'flex',
              marginBottom: 12,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <Icon as={FiAlertTriangle} color="red.400" />
            <Text color="red.400" fontWeight="medium" style={{ marginLeft: 8 }}>
              This message was not sent.
            </Text>
          </div>
        </Tooltip>
      )}
      <Text color="gray.500" fontSize={14}>
        To{' '}
        <span
          style={{
            fontWeight: 'bold',
            color: defaultTheme.colors.blue['400'],
          }}
        >
          {message.contactName}
        </span>
        <span style={{ margin: '0 6px' }}>scheduled for</span>
        <span
          style={{
            fontWeight: 'bold',
            color: missedSend
              ? defaultTheme.colors.red['400']
              : defaultTheme.colors.gray['500'],
          }}
        >
          {new Date(message.sendDate).toLocaleString()}
        </span>
      </Text>

      <Text style={{ marginTop: 8 }}>{message.message}</Text>
      <Box style={{ marginTop: 24 }}>
        <Button
          tabIndex={-1}
          colorScheme="blue"
          size="sm"
          onClick={() => {
            sendMessage();
          }}
          style={{ marginRight: 16 }}
        >
          Send Now
        </Button>
        <Button tabIndex={-1} size="sm" onClick={() => cancelMessage()}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

export function MessageScheduler() {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchScheduledMessages = async () => {
    const results = await ipcRenderer.invoke('get-scheduled-messages');

    setMessages(results);
  };

  useEffect(() => {
    fetchScheduledMessages();
  }, []);

  return (
    <GraphContainer
      title={['Scheduled Messages']}
      description="Schedule a message to be sent automatically at a set time"
      icon={FiWatch}
      onClickMessageScheduler={() => {
        onOpen();
      }}
      onClickMessageSchedulerRefresh={() => {
        fetchScheduledMessages();
      }}
    >
      <div style={{ margin: '24px 0' }}>
        <Stack spacing={8}>
          {messages
            .sort((a, b) => a.sendDate.getTime() - b.sendDate.getTime())
            .map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                refresh={fetchScheduledMessages}
              />
            ))}
          {messages.length === 0 && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: '24px',
              }}
            >
              <Text>{`You haven't scheduled any messages yet.`}</Text>
              <Button
                variant="link"
                onClick={() => onOpen()}
                colorScheme="blue"
                style={{ marginTop: 12 }}
              >
                Schedule One Now!
              </Button>
            </div>
          )}
        </Stack>
        <MessageSchedulerModal
          isOpen={isOpen}
          onClose={onClose}
          refresh={fetchScheduledMessages}
        />
      </div>
    </GraphContainer>
  );
}
