import { Spinner, Text } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { IconType } from 'react-icons';

import { SharedGroupChatTabQueryFilters } from '../../../analysis/queries/filters/sharedGroupChatTabFilters';
import { GroupChatByFriends } from '../../../analysis/queries/GroupChats/GroupChatByFriendsQuery';
import { ShareModal } from '../../Sharing/ShareModal';
import { GraphContainer } from '../GraphContainer';

function GroupChatByFriendsBody({
  title,
  filters,
  isSharingVersion,
  setIsShareOpen,
  loadingOverride,
  colorByContactName,
}: {
  title: string[];
  filters: SharedGroupChatTabQueryFilters;
  isSharingVersion: boolean;
  setIsShareOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadingOverride?: boolean;
  colorByContactName: Record<string, string>;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  const [count, setCount] = useState<number[]>([]);
  const [contactNames, setContactNames] = useState<string[]>([]);

  useEffect(() => {
    async function fetchGroupChatByFriends() {
      setError(null);
      setIsLoading(true);
      try {
        const groupChatByFriendsDataList: GroupChatByFriends[] =
          await ipcRenderer.invoke('query-group-chat-by-friends', filters);

        const MAX_LABEL_LENGTH = 18;
        const cn = groupChatByFriendsDataList.map((obj) => {
          if (obj.contact_name.length > MAX_LABEL_LENGTH) {
            return `${obj.contact_name.substring(0, MAX_LABEL_LENGTH)}...`;
          }
          return obj.contact_name;
        });
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

  // now, we need to get colors in order of labels
  const colorsArray: string[] = [];
  contactNames.forEach((v) => {
    colorsArray.push(colorByContactName[v]);
  });

  const data = {
    labels: contactNames,
    datasets: [
      {
        label: 'Count',
        data: count,
        borderRadius: 5,
        backgroundColor: colorsArray,
      },
    ],
  };

  let longContactName = '';
  if (contactNames.length > 0) {
    const proposedLongContactName = contactNames.reduce((a, b) =>
      a.length > b.length ? a : b
    );
    if (proposedLongContactName.length > 10) {
      longContactName = proposedLongContactName;
    }
  }

  const plugins = {
    title: {
      display: isSharingVersion,
      text: title,
      font: {
        size: 20,
        family: 'Montserrat',
        fontWeight: 'light',
      },
      padding: {
        bottom: 45,
      },
    },
    datalabels: {
      display: isSharingVersion,
      font: {
        size: 14,
        family: 'Montserrat',
        fontWeight: 'light',
      },
      anchor: 'end' as const,
      align: 'end' as const,
      formatter(value: any) {
        return `${value}`;
      },
    },
    'lor-chartjs-logo-watermark-plugin': isSharingVersion
      ? {
          // This algorithm sucks and needs to be reworked
          yPaddingText: 80 + longContactName.length * 2,
          yPaddingLogo: 65 + longContactName.length * 2,
        }
      : false,
  };

  const chartStyle: React.CSSProperties = isSharingVersion
    ? { width: '400px', height: '500px' }
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
    scales: {
      yAxis: {
        grid: {
          display: !isSharingVersion,
        },
        ticks: {
          display: !isSharingVersion,
          precision: 0,
          font: {
            size: 14,
            family: 'Montserrat',
            fontWeight: 'light',
          },
        },
      },
      xAxis: {
        grid: {
          display: !isSharingVersion,
        },
        ticks: {
          precision: 0,
          font: {
            size: 14,
            family: 'Montserrat',
            fontWeight: 'light',
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        // Disable ability to click on legend
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onClick: (_e: any) => null,
      },
      ...plugins,
    },
  };

  const showLoading = loadingOverride || isLoading;
  const graphRefToShare = useRef(null);
  const body = (
    <>
      {error ? (
        <div
          style={{
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
      >
        {body}
      </ShareModal>
    );
  }
  return body;
}

export function GroupChatByFriendsChart({
  title,
  icon,
  filters,
  loadingOverride,
  colorByContactName,
}: {
  title: string[];
  icon: IconType;
  filters: SharedGroupChatTabQueryFilters;
  loadingOverride?: boolean;
  colorByContactName: Record<string, string>;
}) {
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  return (
    <>
      {isShareOpen && (
        <GroupChatByFriendsBody
          title={title}
          filters={filters}
          isSharingVersion
          setIsShareOpen={setIsShareOpen}
          loadingOverride={loadingOverride}
          colorByContactName={colorByContactName}
        />
      )}
      <GraphContainer title={title} icon={icon} setIsShareOpen={setIsShareOpen}>
        <GroupChatByFriendsBody
          title={title}
          filters={filters}
          isSharingVersion={false}
          setIsShareOpen={setIsShareOpen}
          loadingOverride={loadingOverride}
          colorByContactName={colorByContactName}
        />
      </GraphContainer>
    </>
  );
}
