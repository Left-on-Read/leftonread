import {
  Box,
  Skeleton,
  Stack,
  Text,
  theme as defaultTheme,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import { FiVoicemail } from 'react-icons/fi';

import { SharedGroupChatTabQueryFilters } from '../../../analysis/queries/filters/sharedGroupChatTabFilters';
import { FunniestMessageResult } from '../../../analysis/queries/WrappedQueries/FunniestMessageQuery';
import { GraphContainer } from '../GraphContainer';

export function GroupChatFunniestMessage({
  filters,
}: {
  filters: SharedGroupChatTabQueryFilters;
}) {
  const [funniestMessage, setFunniestMessage] =
    useState<FunniestMessageResult>();
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFunniestMessage = async () => {
      setIsLoading(true);
      try {
        // todo
        const results: FunniestMessageResult = await ipcRenderer.invoke(
          'query-funniest-message-group-chat'
        );

        setFunniestMessage(results);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
        log.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFunniestMessage();
  }, []);

  const content =
    isLoading || funniestMessage === undefined ? (
      <>
        <Skeleton height={40} />
      </>
    ) : (
      <Box
        style={{
          border: `1px solid ${defaultTheme.colors.gray['200']}`,
          padding: 32,
          borderRadius: 16,
        }}
        shadow="xl"
      >
        <Text color="gray.500" fontSize={14}>
          From{' '}
          <span
            style={{
              fontWeight: 'bold',
              color: defaultTheme.colors.blue['400'],
            }}
          >
            Jackie Chen
          </span>
        </Text>

        <Text style={{ marginTop: 8 }}>
          {funniestMessage[0].funniestMessage}
        </Text>
      </Box>
    );

  return (
    <GraphContainer
      title={['Funniest Message']}
      description="Funniest Message"
      icon={FiVoicemail}
    >
      <Stack spacing={8}>
        {error && <Text color="red.400">Uh oh! Something went wrong... </Text>}
        {!error && content}
        {funniestMessage === undefined && !error && !isLoading && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: 30,
            }}
          >
            <div
              style={{
                width: '80%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>This chat is not very funny...</Text>
              <Text>No messages found </Text>
            </div>
          </div>
        )}
      </Stack>
    </GraphContainer>
  );
}
