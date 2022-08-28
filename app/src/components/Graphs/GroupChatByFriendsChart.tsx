import { Spinner, Text, theme as defaultTheme } from '@chakra-ui/react';
import { group } from 'console';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { IconType } from 'react-icons';
import Select from 'react-select';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { GroupChatByFriends } from '../../analysis/queries/GroupChatByFriends';
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
  const [groupChatNames, setGroupChatNames] = useState<
    { value: string; label: string }[]
  >([]);
  const [count, setCount] = useState<
    { group_chat_name: string; count: number }[]
  >([]);
  const [contactNames, setContactNames] = useState<
    { contact_name: string; group_chat_name: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchGroupChatByFriends() {
      setError(null);
      setIsLoading(true);
      try {
        const groupChatByFriendsDataList: GroupChatByFriends[] =
          await ipcRenderer.invoke('query-group-chat-by-friends', filters);

        const gt = groupChatByFriendsDataList.map((obj) => obj.group_chat_name);
        const setGct = [...new Set(gt)];

        const gct = setGct.map((name) => {
          return { value: name, label: name };
        });

        setGroupChatNames(gct);

        const ct = groupChatByFriendsDataList.map((obj) => {
          return { count: obj.count, group_chat_name: obj.group_chat_name };
        });
        const cn = groupChatByFriendsDataList.map((obj) => {
          return {
            group_chat_name: obj.group_chat_name,
            contact_name: obj.contact_name,
          };
        });
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

  const contactNamesData = contactNames
    .filter((g) => g.group_chat_name === groupChatToFilterBy)
    .map((c) => c.contact_name);

  const countData = count
    .filter((g) => g.group_chat_name === groupChatToFilterBy)
    .map((c) => c.count);

  const data = {
    labels: contactNamesData,
    datasets: [
      {
        label: 'Count',
        data: countData,
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
        onChange={(val) => {
          if (val && val.label) {
            setGroupChatToFilterBy(val.label);
          }
        }}
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
