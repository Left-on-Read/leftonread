import { Spinner, theme } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { IconType } from 'react-icons';

import { SharedGroupChatTabQueryFilters } from '../../../analysis/queries/filters/sharedGroupChatTabFilters';
import { GroupActivityOverTimeResult } from '../../../analysis/queries/GroupChats/GroupChatActivityOverTimeQuery';
import { generateSampledPoints } from '../../../utils/overTimeHelpers';
import { ShareModal } from '../../Sharing/ShareModal';
import { GraphContainer } from '../GraphContainer';

function GroupChatActivityOverTimeBody({
  title,
  filters,
  isSharingVersion,
  setIsShareOpen,
  colorByContactName,
}: {
  title: string[];
  filters: SharedGroupChatTabQueryFilters;
  isSharingVersion: boolean;
  setIsShareOpen: React.Dispatch<React.SetStateAction<boolean>>;
  colorByContactName: Record<string, string>;
}) {
  const [data, setData] = useState<GroupActivityOverTimeResult[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchTextsOverTime() {
      setIsLoading(true);
      setError(null);
      try {
        const groupChatByFriendsDataList: GroupActivityOverTimeResult[] =
          await ipcRenderer.invoke('query-group-activity-over-time', filters);

        setData(groupChatByFriendsDataList);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
        log.error(`ERROR: fetching for ${title}`, err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTextsOverTime();
  }, [filters, title]);

  const labels = data.map((d) => new Date(d.date).toLocaleDateString());

  const countData = data.map((d) => {
    return {
      y: d.count,
      x: new Date(d.date).toLocaleDateString(),
      is_from_me: 0,
    };
  });

  // Batch by week
  const MAX_POINTS = 30;
  const minLength = countData.length;
  let batchSize = 1;
  if (minLength > MAX_POINTS) {
    batchSize = Math.floor(minLength / MAX_POINTS);
  }
  const sampledData = generateSampledPoints(countData, batchSize);

  const chartData = {
    labels,
    datasets: [
      {
        backgroundColor: theme.colors.blue['300'],
        label: 'Texts',
        borderColor: theme.colors.blue['500'],
        borderWidth: 0.8,
        data: sampledData,
      },
    ],
  };

  // You want to go off of the group chat name, and not the number of contacts
  // because you want to use the group chat name if it exists
  let titleLabel = title;
  if (title && title.length > 1 && title[1].length > 25) {
    titleLabel = [title[0], ...title[1].split(', ')];
  }

  const plugins = {
    title: {
      display: isSharingVersion,
      text: titleLabel,
      font: {
        size: 20,
        family: 'Montserrat',
        fontWeight: 'light',
      },
    },
    datalabels: {
      display: false,
    },
    'lor-chartjs-logo-watermark-plugin': isSharingVersion
      ? {
          yPaddingText: 100,
          yPaddingLogo: 85,
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
    scales: {
      yAxis: {
        ticks: {
          precision: 0,
          font: {
            size: 14,
            family: 'Montserrat',
            fontWeight: 'light',
          },
        },
      },
      xAxis: {
        ticks: {
          // value is of type number but Line props doesn't like that...
          callback: (value: any) => {
            return new Date(labels[value]).toLocaleDateString();
          },
          font: {
            size: 14,
            family: 'Montserrat',
            fontWeight: 'light',
          },
          maxTicksLimit: 12,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context: any) => {
            return context[0].raw.label;
          },
        },
      },
      legend: {
        display: false,
        // Disable ability to click on legend
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
        <Line data={{ labels: [], datasets: [] }} options={options} />
      ) : (
        <>
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
          <div style={chartStyle}>
            <Line data={chartData} options={options} ref={graphRefToShare} />
          </div>
        </>
      )}
    </>
  );
  if (isSharingVersion) {
    return (
      <ShareModal
        title="Group Chat Activity Over Time"
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

export function GroupChatActivityOverTimeChart({
  title,
  description,
  icon,
  filters,
  colorByContactName,
  isPremiumGraph,
}: {
  title: string[];
  description: string;
  icon: IconType;
  filters: SharedGroupChatTabQueryFilters;
  colorByContactName: Record<string, string>;
  isPremiumGraph?: boolean;
}) {
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  return (
    <>
      {isShareOpen && (
        <GroupChatActivityOverTimeBody
          title={title}
          filters={filters}
          isSharingVersion
          setIsShareOpen={setIsShareOpen}
          colorByContactName={colorByContactName}
        />
      )}
      <GraphContainer
        title={title}
        description={description}
        icon={icon}
        setIsShareOpen={setIsShareOpen}
        showGroupChatShareButton
        isPremiumGraph={isPremiumGraph}
      >
        <GroupChatActivityOverTimeBody
          title={title}
          filters={filters}
          isSharingVersion={false}
          setIsShareOpen={setIsShareOpen}
          colorByContactName={colorByContactName}
        />
      </GraphContainer>
    </>
  );
}
