import { Spinner, Text, theme } from '@chakra-ui/react';
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

export function GroupChatActivityOverTimeChart({
  title,
  description,
  icon,
  filters,
}: {
  title: string[];
  description: string;
  icon: IconType;
  filters: SharedGroupChatTabQueryFilters;
}) {
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
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
        backgroundColor: theme.colors.blue['200'],
        label: 'Texts',
        borderColor: theme.colors.blue['400'],
        borderWidth: 0.8,
        data: sampledData,
      },
    ],
  };

  const sharingLabel = isShareOpen
    ? {
        title: {
          display: true,
          text: title,
          font: {
            size: 18,
          },
        },
        // subtitle: {
        //   display: true,
        //   text: 'Analyzed with https://leftonread.me/',
        //   padding: {
        //     bottom: 10,
        //   },
        //   font: {
        //     size: 12,
        //   },
        // },
      }
    : { 'lor-chartjs-logo-watermark-plugin': false };

  const options = {
    scales: {
      yAxis: {
        ticks: {
          precision: 0,
        },
      },
      xAxis: {
        ticks: {
          // value is of type number but Line props doesn't like that...
          callback: (value: any) => {
            return new Date(labels[value]).toLocaleDateString();
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
      },
      ...sharingLabel,
    },
  };

  const graphRefToShare = useRef(null);
  const body = (
    <>
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
          <Line data={{ labels: [], datasets: [] }} options={options} />
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
          <Line data={chartData} options={options} ref={graphRefToShare} />
        </div>
      )}
    </>
  );
  return (
    <>
      <GraphContainer
        title={title}
        description={description}
        icon={icon}
        setIsShareOpen={setIsShareOpen}
      >
        {body}
      </GraphContainer>
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        graphRefToShare={graphRefToShare}
      >
        {body}
      </ShareModal>
    </>
  );
}
