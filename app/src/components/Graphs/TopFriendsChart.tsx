import {
  Icon,
  Spinner,
  Text,
  theme as defaultTheme,
  Tooltip,
} from '@chakra-ui/react';
import { GroupChatFilters } from 'constants/filters';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { IconType } from 'react-icons';
import { FiInfo } from 'react-icons/fi';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { TTopFriendsResults } from '../../analysis/queries/TopFriendsQuery';
import { GraphContainer } from './GraphContainer';

export function TopFriendsChart({
  title,
  description,
  icon,
  filters,
  loadingOverride,
}: {
  title: string;
  description: string;
  icon: IconType;
  filters: SharedQueryFilters;
  loadingOverride?: boolean;
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
        label: 'Sent',
        data: sent,
        backgroundColor: defaultTheme.colors.blue['200'],
        borderColor: defaultTheme.colors.blue['400'],
        borderRadius: 5,
      },
      {
        label: 'Received',
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

  const showLoading = loadingOverride || isLoading;

  const graphRefToShare = useRef(null);
  return (
    <GraphContainer
      graphRefToShare={graphRefToShare}
      title={title}
      description={description}
      icon={icon}
      tooltip={
        filters.groupChat === GroupChatFilters.BOTH ? (
          <Tooltip
            label="When including group chats, Left on Read attributes your sent messages to the group itself, and does not spread the count across the individuals of the group."
            fontSize="md"
          >
            <span>
              <Icon as={FiInfo} color="gray.500" />
            </span>
          </Tooltip>
        ) : null
      }
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
          {showLoading && (
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
