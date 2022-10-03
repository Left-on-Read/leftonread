import {
  Icon,
  Spinner,
  theme as defaultTheme,
  Tooltip,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { IconType } from 'react-icons';
import { FiInfo } from 'react-icons/fi';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { TTopFriendsResults } from '../../analysis/queries/TopFriendsQuery';
import { GroupChatFilters } from '../../constants/filters';
import { ShareModal } from '../Sharing/ShareModal';
import { GraphContainer } from './GraphContainer';

function TopFriendsBody({
  title,
  filters,
  isSharingVersion,
  setIsShareOpen,
  loadingOverride,
}: {
  title: string[];
  filters: SharedQueryFilters;
  isSharingVersion: boolean;
  setIsShareOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
          { ...filters, limit: isSharingVersion ? 5 : 10 }
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
  }, [filters, title, isSharingVersion]);

  const data = {
    labels: friends,
    datasets: [
      {
        label: 'Sent',
        data: sent,
        backgroundColor: defaultTheme.colors.blue['300'],
        borderColor: defaultTheme.colors.blue['500'],
        borderRadius: 5,
      },
      {
        label: 'Received',
        data: received,
        backgroundColor: defaultTheme.colors.gray['300'],
        borderColor: defaultTheme.colors.gray['500'],
        borderRadius: 5,
      },
    ],
  };

  const plugins = {
    title: {
      display: isSharingVersion,
      text: title,
      font: {
        size: 20,
        family: 'Montserrat',
        fontWeight: 'light',
      },
    },
    // datalabels: {
    //   font: {
    //     size: isSharingVersion ? 12 : 12,
    //     family: 'Montserrat',
    //     fontWeight: 'light',
    //   },
    //   anchor: 'end' as const,
    //   align: 'end' as const,
    //   formatter(value: any) {
    //     return `${value}`;
    //   },
    // },
    datalabels: {
      display: false,
    },
    'lor-chartjs-logo-watermark-plugin': isSharingVersion
      ? {
          yPaddingText: filters.contact?.length === 1 ? 55 : 112,
          yPaddingLogo: filters.contact?.length === 1 ? 45 : 100,
        }
      : false,
  };

  const chartStyle: React.CSSProperties = isSharingVersion
    ? { width: '500px', height: '500px' }
    : {};

  const options = {
    maintainAspectRatio: isSharingVersion ? false : undefined,
    layout: isSharingVersion
      ? {
          padding: {
            bottom: 65,
            left: 35,
            right: 35,
            top: 25,
          },
        }
      : {},
    scales: isSharingVersion
      ? {
          yAxis: {
            grid: {
              display: false,
            },
            ticks: {
              precision: 0,
              font: { size: 0 },
            },
          },
          xAxis: {
            grid: {
              display: true,
            },
            ticks: {
              font: {
                size: 14,
                family: 'Montserrat',
                fontWeight: 'light',
              },
              precision: 0,
            },
          },
        }
      : {
          yAxis: {
            ticks: {
              precision: 0,
              font: {
                family: 'Montserrat',
                fontWeight: 'light',
              },
            },
          },
          xAxis: {
            ticks: {
              precision: 0,
              font: {
                size: filters.contact ? 14 : 13,
                family: 'Montserrat',
                fontWeight: 'light',
              },
            },
          },
        },
    plugins: {
      // Disable ability to click on legend
      legend: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onClick: (_e: any) => null,
        labels: {
          font: {
            family: 'Montserrat',
            fontWeight: 'light',
            size: 14,
          },
        },
      },
      ...plugins,
    },
  };

  const showLoading = loadingOverride || isLoading;
  const graphRefToShare = useRef(null);
  const body = (
    <>
      {error ? (
        // <div
        //   style={{
        //     display: 'flex',
        //     justifyContent: 'center',
        //     alignItems: 'center',
        //   }}
        // >
        //   <div style={{ position: 'absolute' }}>
        //     <Text color="red.400">Uh oh! Something went wrong... </Text>
        //   </div>
        <Bar data={{ labels: [], datasets: [] }} />
      ) : (
        // </div>
        <>
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
          <div style={chartStyle}>
            <Bar data={data} options={options} ref={graphRefToShare} />
          </div>
        </>
      )}
    </>
  );

  if (isSharingVersion) {
    return (
      <ShareModal
        isOpen={isSharingVersion}
        onClose={() => setIsShareOpen(false)}
        graphRefToShare={graphRefToShare}
        title="Top Messaged Friends"
      >
        {body}
      </ShareModal>
    );
  }
  return body;
}

export function TopFriendsChart({
  title,
  description,
  icon,
  filters,
  loadingOverride,
}: {
  title: string[];
  description: string;
  icon: IconType;
  filters: SharedQueryFilters;
  loadingOverride?: boolean;
}) {
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  return (
    <>
      {isShareOpen && (
        <TopFriendsBody
          title={title}
          filters={filters}
          isSharingVersion
          setIsShareOpen={setIsShareOpen}
          loadingOverride={loadingOverride}
        />
      )}
      <GraphContainer
        title={title}
        description={description}
        icon={icon}
        setIsShareOpen={setIsShareOpen}
        tooltip={
          filters.groupChat === GroupChatFilters.BOTH ? (
            <Tooltip
              label="When including group chats, Left on Read attributes your sent messages to the group itself. It does not spread the sent count across the individuals of the group."
              fontSize="md"
            >
              <span>
                <Icon as={FiInfo} color="gray.500" />
              </span>
            </Tooltip>
          ) : null
        }
      >
        <TopFriendsBody
          title={title}
          filters={filters}
          isSharingVersion={false}
          setIsShareOpen={setIsShareOpen}
          loadingOverride={loadingOverride}
        />
      </GraphContainer>
    </>
  );
}
