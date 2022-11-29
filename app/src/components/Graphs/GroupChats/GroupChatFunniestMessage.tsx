import {
  Box,
  Icon,
  Stack,
  Text,
  theme as defaultTheme,
  Tooltip,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import { FiInfo, FiSmile } from 'react-icons/fi';

import { SharedGroupChatTabQueryFilters } from '../../../analysis/queries/filters/sharedGroupChatTabFilters';
import { FunniestMessageResult } from '../../../analysis/queries/WrappedQueries/FunniestMessageQuery';
import { GraphContainer } from '../GraphContainer';

export function GroupChatFunniestMessage({
  filters,
}: {
  filters: SharedGroupChatTabQueryFilters;
}) {
  const [funniestMessage, setFunniestMessage] = useState<
    FunniestMessageResult | undefined
  >();
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFunniestMessage = async () => {
      setIsLoading(true);
      try {
        const results: FunniestMessageResult = await ipcRenderer.invoke(
          'query-funniest-message-group-chat',
          filters
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
  }, [filters]);

  return (
    <GraphContainer
      title={[
        `Funniest Message in ${filters.groupChatName.replaceAll(',', ', ')}`,
      ]}
      description="The message with the most Hahas"
      icon={FiSmile}
      tooltip={
        <Tooltip
          label="Reactions were added in iOS 10 in September 2016. If nothing is showing, your group chat may be too old."
          fontSize="md"
        >
          <span>
            <Icon as={FiInfo} color="gray.500" />
          </span>
        </Tooltip>
      }
    >
      <Stack spacing={8}>
        {error && <Text color="red.400">Uh oh! Something went wrong... </Text>}
        {funniestMessage && funniestMessage.length < 1 && !error && !isLoading && (
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
              <Text style={{ fontSize: '18px', color: 'gray' }}>
                No messages with laughs found 😭
              </Text>
            </div>
          </div>
        )}
        {!error && funniestMessage && funniestMessage.length > 0 && (
          <Box
            style={{
              border: `1px solid ${defaultTheme.colors.gray['200']}`,
              padding: 32,
              borderRadius: 16,
            }}
            shadow="xl"
          >
            <Text color="gray.500" fontSize={14}>
              {funniestMessage[0].numberReactions} Haha
              {funniestMessage[0].numberReactions > 1 ? 's' : ''}
            </Text>

            <Text style={{ marginTop: 8 }}>
              {funniestMessage[0].funniestMessage}
            </Text>

            <Text color="gray.500" fontSize={14}>
              From{' '}
              <span
                style={{
                  fontWeight: 'bold',
                  color: defaultTheme.colors.blue['400'],
                }}
              >
                {funniestMessage[0].contactName}
              </span>
            </Text>
          </Box>
        )}
      </Stack>
    </GraphContainer>
  );
}
