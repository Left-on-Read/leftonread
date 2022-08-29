import { Spinner, Text, theme as defaultTheme } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { IconType } from 'react-icons';

import { SharedGroupChatTabQueryFilters } from '../../../analysis/queries/filters/sharedGroupChatTabFilters';
import { GroupChatByFriends } from '../../../analysis/queries/GroupChatByFriendsQuery';
import { useGlobalContext } from '../../Dashboard/GlobalContext';
import { GraphContainer } from '../GraphContainer';

export function GroupChatByFriendsChart({
  title,
  icon,
  filters,
  loadingOverride,
}: {
  title: string;
  icon: IconType;
  filters: SharedGroupChatTabQueryFilters;
  loadingOverride?: boolean;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  const [count, setCount] = useState<number[]>([]);
  const [contactNames, setContactNames] = useState<string[]>([]);

  const { dateRange } = useGlobalContext();

  useEffect(() => {
    async function fetchGroupChatByFriends() {
      setError(null);
      setIsLoading(true);
      try {
        const groupChatByFriendsDataList: GroupChatByFriends[] =
          await ipcRenderer.invoke('query-group-chat-by-friends', filters);

        const cn = groupChatByFriendsDataList.map((obj) => obj.contact_name);
        const ct = groupChatByFriendsDataList.map((obj) => obj.count);

        setContactNames(cn);
        setCount(ct);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
        log.error(`ERROR: fetching for ${title}`, err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGroupChatByFriends();
  }, [filters, title]);

  const data = {
    labels: contactNames,
    datasets: [
      {
        label: 'Count',
        data: count,
        backgroundColor: defaultTheme.colors.blue['200'],
        borderColor: defaultTheme.colors.blue['400'],
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
    <>
      <GraphContainer
        graphRefToShare={graphRefToShare}
        title={title}
        description={
          contactNames.length > 0
            ? `${
                contactNames[contactNames.length - 1]
              } takes the cake as the most talkative between ${
                filters.timeRange?.startDate
                  ? filters.timeRange?.startDate.toLocaleDateString()
                  : dateRange.earliestDate.toLocaleDateString()
              } and ${
                filters.timeRange?.endDate
                  ? filters.timeRange?.endDate.toLocaleDateString()
                  : dateRange.latestDate.toLocaleDateString()
              } 🏆`
            : ''
        }
        icon={icon}
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
    </>
  );
}
