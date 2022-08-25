import { Spinner, Text, theme as defaultTheme } from '@chakra-ui/react';
import { TopSentimentFriendsResult } from 'analysis/queries/TopSentimentFriendsQuery';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { IconType } from 'react-icons';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { GraphContainer } from './GraphContainer';

export function TopSentimentFriendsChart({
  title,
  description,
  icon,
  filters,
}: {
  title: string;
  description?: string;
  icon: IconType;
  filters: SharedQueryFilters;
}) {
  const [friends, setFriends] = useState<string[]>([]);
  const [received, setReceived] = useState<number[]>([]);
  const [sent, setSent] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchTopFriends() {
      setError(null);
      setIsLoading(true);
      try {
        const topFriendsDataList: TopSentimentFriendsResult[] =
          await ipcRenderer.invoke('query-top-sentiment-friends', filters);

        setFriends(topFriendsDataList.map((obj) => obj.friend));
        setSent(topFriendsDataList.map((obj) => obj.sentPct));
        setReceived(topFriendsDataList.map((obj) => obj.receivedPct));
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
        log.error(`ERROR: fetching for ${title}`, err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTopFriends();
  }, [filters, title]);

  const data = {
    labels: friends,
    datasets: [
      {
        label: 'Sent Positivity %',
        data: sent,
        backgroundColor: defaultTheme.colors.green['200'],
        borderColor: defaultTheme.colors.green['500'],
        borderRadius: 5,
      },
      {
        label: 'Received Positivity %',
        data: received,
        backgroundColor: defaultTheme.colors.gray['200'],
        borderColor: defaultTheme.colors.gray['500'],
        borderRadius: 5,
      },
    ],
  };

  const options = {
    scales: {
      yAxis: {
        ticks: {
          precision: 0,
        },
      },
      xAxis: {
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const graphRefToShare = useRef(null);
  return (
    <GraphContainer
      title={title}
      description={description}
      icon={icon}
      graphRefToShare={graphRefToShare}
    >
      {error ? (
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'absolute' }}>
            <Text color="red.400">Uh oh! Something went wrong... </Text>
          </div>
          <Bar data={{ labels: [], datasets: [] }} />
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {isLoading && (
            <div
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                top: 0,
                left: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              <Spinner color="purple.400" size="xl" />
            </div>
          )}
          <Bar data={data} options={options} ref={graphRefToShare} />
        </div>
      )}
    </GraphContainer>
  );
}
