import { Icon, Spinner, theme, Tooltip } from '@chakra-ui/react';
import { SentimentOverTimeResult } from 'analysis/queries/SentimentOverTimeQuery';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { IconType } from 'react-icons';
import { FiInfo } from 'react-icons/fi';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { generateSampledPoints } from '../../utils/overTimeHelpers';
import { ShareModal } from '../Sharing/ShareModal';
import { GraphContainer } from './GraphContainer';

function SentimentOverTimeBody({
  title,
  filters,
  isSharingVersion,
  setIsShareOpen,
}: {
  title: string[];

  filters: SharedQueryFilters;
  isSharingVersion: boolean;
  setIsShareOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [sent, setSent] = useState<SentimentOverTimeResult[]>([]);
  const [received, setReceived] = useState<SentimentOverTimeResult[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchTextsOverTime() {
      setIsLoading(true);
      setError(null);
      try {
        const [sentSentiment, receivedSentiment]: [
          SentimentOverTimeResult[],
          SentimentOverTimeResult[]
        ] = await Promise.all([
          ipcRenderer.invoke('query-sentiment-over-time-sent', filters),
          ipcRenderer.invoke('query-sentiment-over-time-received', filters),
        ]);

        setSent(sentSentiment);
        setReceived(receivedSentiment);
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

  const labels = sent.map((d) => new Date(d.day).toLocaleDateString());

  const sentData = sent.map((d) => {
    return {
      y:
        (d.positiveScore === 0 && d.negativeScore === 0
          ? 0.5
          : d.positiveScore / (d.positiveScore + Math.abs(d.negativeScore))) *
        100,
      x: new Date(d.day).toLocaleDateString(),
      is_from_me: d.is_from_me,
    };
  });
  const receivedData = received.map((d) => {
    return {
      y:
        (d.positiveScore === 0 && d.negativeScore === 0
          ? 0.5
          : d.positiveScore / (d.positiveScore + Math.abs(d.negativeScore))) *
        100,
      x: new Date(d.day).toLocaleDateString(),
      is_from_me: d.is_from_me,
    };
  });

  // Batch by week
  const MAX_POINTS = 30;
  const minLength = Math.max(sentData.length, receivedData.length);
  let batchSize = 1;
  if (minLength > MAX_POINTS) {
    batchSize = Math.floor(minLength / MAX_POINTS);
  }
  const sampledSentData = generateSampledPoints(sentData, batchSize);
  const sampledReceivedData = generateSampledPoints(receivedData, batchSize);

  const data = {
    labels,
    datasets: [
      {
        backgroundColor: theme.colors.green['200'],
        label: isSharingVersion ? 'Sent Texts' : 'Sent Texts Score',
        borderColor: theme.colors.green['400'],
        borderWidth: 0.8,
        data: sampledSentData,
      },
      {
        backgroundColor: theme.colors.gray['200'],
        label: isSharingVersion ? 'Received Texts' : 'Received Texts Score',
        borderColor: theme.colors.gray['400'],
        borderWidth: 0.8,
        data: sampledReceivedData,
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
    datalabels: {
      display: false,
    },
    'lor-chartjs-logo-watermark-plugin': isSharingVersion
      ? {
          yPaddingText: 122,
          yPaddingLogo: 110,
        }
      : false,
    'lor-chartjs-no-data-to-display-message': !error,
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
          maxTicksLimit: 12,
          font: {
            size: 14,
            family: 'Montserrat',
            fontWeight: 'light',
          },
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
            <Line ref={graphRefToShare} data={data} options={options} />
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
        title="Sentiment Over Time"
        contacts={
          filters.contact?.length === 1
            ? filters.contact?.map((c) => c.value)
            : undefined
        }
      >
        {body}
      </ShareModal>
    );
  }
  return body;
}

export function SentimentOverTimeChart({
  title,
  description,
  icon,
  filters,
}: {
  title: string[];
  description?: string;
  icon: IconType;
  filters: SharedQueryFilters;
}) {
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  return (
    <>
      {isShareOpen && (
        <SentimentOverTimeBody
          title={title}
          filters={filters}
          isSharingVersion
          setIsShareOpen={setIsShareOpen}
        />
      )}
      <GraphContainer
        title={title}
        description={description}
        icon={icon}
        setIsShareOpen={setIsShareOpen}
        isPremiumGraph
        tooltip={
          <Tooltip
            label="To filter for a specific time period, use the Adjust Filters button at the top. If you see a large gap in data, this might be because your iMessage app has iCloud syncing turned on."
            fontSize="md"
          >
            <span>
              <Icon as={FiInfo} color="gray.500" />
            </span>
          </Tooltip>
        }
      >
        <SentimentOverTimeBody
          title={title}
          filters={filters}
          isSharingVersion={false}
          setIsShareOpen={setIsShareOpen}
        />
      </GraphContainer>
    </>
  );
}
