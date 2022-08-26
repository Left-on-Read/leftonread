import { Spinner, Text, theme as defaultTheme } from '@chakra-ui/react';
import { GroupChatFilters } from 'constants/filters';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
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
  const [groupChatSent, setGroupChatSent] = useState<number[]>([]);
  const [groupChatReceived, setGroupChatReceived] = useState<number[]>([]);

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
        console.log(topFriendsDataList);
        // Example data
        // [
        //  {count: 6, friend: 'Alex Danilowicz', is_from_me: 'false', group_chat: 'true'}
        //  {count: 13, friend: 'Alex Danilowicz', is_from_me: 'true', group_chat: 'false'}
        //  {count: 4, friend: 'Teddy Ni', is_from_me: 'false', group_chat: 'true'}
        //  {count: 1, friend: 'Teddy Ni', is_from_me: 'true', group_chat: 'false'}
        //  {count: 2, friend: 'Teddy Ni,Alex Danilowicz', is_from_me: 'true', group_chat: 'true'}
        // ]
        // setFriends(topFriendsDataList.map((obj) => obj.friend));
        // setSent(topFriendsDataList.map((obj) => obj.sent));
        // setReceived(topFriendsDataList.map((obj) => obj.received));

        // construct totals
        const totalByFriendRegardlessOfChat: Record<string, number> = {};

        const totalByFriendNotGroupChatSent: Record<string, number> = {};
        const totalByFriendNotGroupChatReceived: Record<string, number> = {};

        const totalByFriendGroupChatSent: Record<string, number> = {};
        const totalByFriendGroupChatReceived: Record<string, number> = {};

        // Split the friend: 'Teddy Ni,Alex Danilowicz' values into seperate rows
        const topFriendsDataListFinal: TTopFriendsResults = [];
        topFriendsDataList.forEach((obj) => {
          // if a contact has a comma in, then this will break...
          if (obj.friend.includes(',') && obj.group_chat === 'true') {
            obj.friend.split(',').forEach((f) => {
              topFriendsDataListFinal.push({
                ...obj,
                friend: f,
              });
            });
          } else {
            topFriendsDataListFinal.push(obj);
          }
        });
        console.log(topFriendsDataListFinal);

        topFriendsDataListFinal.forEach((obj) => {
          if (!totalByFriendRegardlessOfChat[obj.friend]) {
            totalByFriendRegardlessOfChat[obj.friend] = 0;
          }

          if (!totalByFriendNotGroupChatSent[obj.friend]) {
            totalByFriendNotGroupChatSent[obj.friend] = 0;
          }

          if (!totalByFriendNotGroupChatReceived[obj.friend]) {
            totalByFriendNotGroupChatReceived[obj.friend] = 0;
          }

          if (!totalByFriendGroupChatSent[obj.friend]) {
            totalByFriendGroupChatSent[obj.friend] = 0;
          }

          if (!totalByFriendGroupChatReceived[obj.friend]) {
            totalByFriendGroupChatReceived[obj.friend] = 0;
          }

          totalByFriendRegardlessOfChat[obj.friend] += obj.count;
          if (obj.group_chat === 'false') {
            if (obj.is_from_me === 'true') {
              totalByFriendNotGroupChatSent[obj.friend] += obj.count;
            } else {
              totalByFriendNotGroupChatReceived[obj.friend] += obj.count;
            }
          } else if (obj.group_chat === 'true') {
            if (obj.is_from_me === 'true') {
              totalByFriendGroupChatSent[obj.friend] += obj.count;
            } else {
              totalByFriendGroupChatReceived[obj.friend] += obj.count;
            }
          }
        });

        const sortedByTotal = Object.fromEntries(
          Object.entries(totalByFriendRegardlessOfChat).sort(
            ([, a], [, b]) => b - a
          )
        );
        console.log(sortedByTotal);
        setFriends(Object.keys(sortedByTotal));
        setSent(Object.values(totalByFriendNotGroupChatSent));
        setReceived(Object.values(totalByFriendNotGroupChatReceived));
        setGroupChatReceived(Object.values(totalByFriendGroupChatReceived));
        setGroupChatSent(Object.values(totalByFriendGroupChatSent));
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
      filters.groupChat === GroupChatFilters.BOTH
        ? {
            label: 'Group Chat Sent',
            data: groupChatSent,
            backgroundColor: defaultTheme.colors.blue['600'],
            borderColor: defaultTheme.colors.blue['900'],
            borderRadius: 5,
          }
        : { label: '', backgroundColor: 'white' },
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
      filters.groupChat === GroupChatFilters.BOTH
        ? {
            label: 'Group Chat Received',
            data: groupChatReceived,
            backgroundColor: defaultTheme.colors.gray['600'],
            borderColor: defaultTheme.colors.gray['900'],
            borderRadius: 5,
          }
        : { label: '', backgroundColor: 'white' },
    ],
  };

  const options = {
    scales: {
      yAxis: {
        ticks: {
          precision: 0,
        },
        stacked: true,
      },
      xAxis: {
        ticks: {
          precision: 0,
        },
        stacked: true,
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
