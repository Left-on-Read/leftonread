import {
  Skeleton,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import { IconType } from 'react-icons';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { TotalSentVsReceivedResults } from '../../analysis/queries/TotalSentVsReceivedQuery';
import { GraphContainer } from './GraphContainer';

export function SentVsReceivedChart({
  title,
  description,
  icon,
  filters,
  loadingOverride,
}: {
  title: string[];
  description?: string;
  icon: IconType;
  filters: SharedQueryFilters;
  loadingOverride?: boolean;
}) {
  const [received, setReceived] = useState<number>();
  const [sent, setSent] = useState<number>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchSentVsReceived() {
      setError(null);
      setIsLoading(true);
      try {
        const sentVsReceivedDataList: TotalSentVsReceivedResults =
          await ipcRenderer.invoke('query-total-sent-vs-received', filters);

        const receivedList = sentVsReceivedDataList.filter(
          (obj) => obj.is_from_me === 0
        );
        const sentList = sentVsReceivedDataList.filter(
          (obj) => obj.is_from_me === 1
        );

        setReceived(receivedList[0]?.total ?? 0);
        setSent(sentList[0]?.total ?? 0);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
        log.error(`ERROR: fetching for ${title}`, err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSentVsReceived();
  }, [filters, title]);

  const showLoading = loadingOverride || isLoading;

  return (
    <GraphContainer title={title} description={description} icon={icon}>
      {error ? (
        <Text color="red.400">Uh oh! Something went wrong.</Text>
      ) : (
        <>
          <StatGroup style={{ marginBottom: 5 }}>
            <Stat>
              <StatLabel>Total</StatLabel>
              <StatNumber>
                <div style={{ height: 50 }}>
                  {showLoading ? (
                    <div style={{ paddingRight: 48 }}>
                      <Skeleton height={35} width={130} />
                    </div>
                  ) : (
                    <Text
                      bgGradient="linear(to-r, blue.400, green.400)"
                      bgClip="text"
                      fontSize="5xl"
                      fontWeight="extrabold"
                    >
                      {((received ?? 0) + (sent ?? 0)).toLocaleString()}
                    </Text>
                  )}
                </div>
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Sent</StatLabel>
              <StatNumber>
                <div style={{ height: 50 }}>
                  {showLoading ? (
                    <div style={{ paddingRight: 48 }}>
                      <Skeleton height={35} />
                    </div>
                  ) : (
                    <Text
                      bgGradient="linear(to-r, green.400, purple.400)"
                      bgClip="text"
                      fontSize="5xl"
                      fontWeight="extrabold"
                    >
                      {sent?.toLocaleString()}
                    </Text>
                  )}
                </div>
              </StatNumber>
            </Stat>

            <Stat>
              <StatLabel>Received</StatLabel>
              <StatNumber>
                {showLoading ? (
                  <div style={{ paddingRight: 48 }}>
                    <Skeleton height={35} />
                  </div>
                ) : (
                  <Text
                    bgGradient="linear(to-r, purple.400, red.400)"
                    bgClip="text"
                    fontSize="5xl"
                    fontWeight="extrabold"
                  >
                    {received?.toLocaleString()}
                  </Text>
                )}
              </StatNumber>
            </Stat>
          </StatGroup>
        </>
      )}
    </GraphContainer>
  );
}
