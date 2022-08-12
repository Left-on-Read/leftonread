import { Spinner, Text, theme as defaultTheme } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { IconType } from 'react-icons';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { TTopFriendsResults } from '../../analysis/queries/TopFriendsQuery';
import { GraphContainer } from './GraphContainer';

export function TopFriendsChart({
  title,
  description,
  icon,
  filters,
}: {
  title: string;
  description: string;
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
        const topFriendsDataList: TTopFriendsResults = await ipcRenderer.invoke(
          'query-top-friends',
          filters
        );
        setFriends(topFriendsDataList.map((obj) => obj.friend));
        setSent(topFriendsDataList.map((obj) => obj.sent));
        setReceived(topFriendsDataList.map((obj) => obj.received));
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
        label: 'Received',
        data: received,
        backgroundColor: defaultTheme.colors.gray['200'],
        borderColor: defaultTheme.colors.gray['500'],
        borderRadius: 5,
      },
      {
        label: 'Sent',
        data: sent,
        backgroundColor: defaultTheme.colors.blue['200'],
        borderColor: defaultTheme.colors.blue['400'],
        borderRadius: 5,
      },
    ],
  };

  let graphContent = <Bar data={data} />;
  if (isLoading) {
    graphContent = (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'absolute' }}>
          <Spinner color="purple.400" size="xl" />
        </div>
        <Bar data={{ labels: [], datasets: [] }} />
      </div>
    );
  } else if (error) {
    graphContent = (
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
    );
  }

  return (
    <GraphContainer title={title} description={description} icon={icon}>
      {graphContent}
    </GraphContainer>
  );
}
