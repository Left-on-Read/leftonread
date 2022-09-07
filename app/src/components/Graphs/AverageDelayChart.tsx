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

import { AverageDelayResult } from '../../analysis/queries/AverageDelayQuery';
import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { GraphContainer } from './GraphContainer';

const formatSeconds = (seconds: number) => {
  if (seconds < 300) {
    return `${seconds.toLocaleString()} seconds`;
  }

  const minutes = seconds / 60;
  if (minutes < 150) {
    return `${minutes.toLocaleString()} minutes`;
  }

  const hours = minutes / 60;
  if (hours < 100) {
    return `${hours.toLocaleString()} hours`;
  }

  const days = hours / 24;

  return `${days.toLocaleString()} days`;
};

export function AverageDelayChart({
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
    async function fetchAverageDelay() {
      setError(null);
      setIsLoading(true);
      try {
        const results: AverageDelayResult[] = await ipcRenderer.invoke(
          'query-average-delay',
          filters
        );

        const receivedResult = results.filter(
          (result) => result.isFromMe === 0
        );

        const sentResult = results.filter((result) => result.isFromMe === 1);

        if (receivedResult.length === 1) {
          setReceived(receivedResult[0].averageDelayInSeconds);
        }

        if (sentResult.length === 1) {
          setSent(sentResult[0].averageDelayInSeconds);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
        log.error(`ERROR: fetching for ${title}`, err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAverageDelay();
  }, [filters, title]);

  const showLoading = loadingOverride || isLoading;

  return (
    <GraphContainer title={title} description={description} icon={icon}>
      {error ? (
        <Text color="red.400">Uh oh! Something went wrong.</Text>
      ) : (
        <StatGroup>
          <Stat>
            <StatLabel>Sent</StatLabel>
            <StatNumber>
              <div style={{ height: 50 }}>
                {showLoading ? (
                  <div style={{ paddingRight: 48 }}>
                    <Skeleton height={35} />
                  </div>
                ) : (
                  <>{formatSeconds(sent ?? 0)}</>
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
                <>{formatSeconds(received ?? 0)}</>
              )}
            </StatNumber>
          </Stat>
        </StatGroup>
      )}
    </GraphContainer>
  );
}
