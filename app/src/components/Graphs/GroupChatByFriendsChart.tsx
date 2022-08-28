import {
  Icon,
  Spinner,
  Text,
  theme as defaultTheme,
  Tooltip,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { IconType } from 'react-icons';
import { FiInfo } from 'react-icons/fi';
import { MultiSelect } from 'react-multi-select-component';
import Select from 'react-select';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { GroupChatByFriends } from '../../analysis/queries/GroupChatByFriends';
import { GroupChatFilters } from '../../constants/filters';
import { GraphContainer } from './GraphContainer';

export function GroupChatByFriendsChart({
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
  const [groupChatToFilterBy, setGroupChatToFilterBy] = useState<string | null>(
    null
  );
  const [groupChatNames, setGroupChatNames] = useState<string[]>([]);
  const [count, setCount] = useState<number[]>([]);
  const [contactNames, setContactNames] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchGroupChatByFriends() {
      setError(null);
      setIsLoading(true);
      try {
        const groupChatByFriendsDataList: GroupChatByFriends[] =
          await ipcRenderer.invoke('query-group-chat-by-friends', filters);

        setGroupChatNames(
          groupChatByFriendsDataList.map((obj) => obj.group_chat_name)
        );
        setCount(groupChatByFriendsDataList.map((obj) => obj.count));
        setContactNames(
          groupChatByFriendsDataList.map((obj) => obj.contact_name)
        );
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
      <Select
        value={groupChatToFilterBy}
        onChange={(val) => setGroupChatToFilterBy(val)}
        options={groupChatNames}
      />
      <GraphContainer
        graphRefToShare={graphRefToShare}
        title={title}
        description={description}
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
