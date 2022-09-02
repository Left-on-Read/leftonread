import { Spinner, Text, theme } from '@chakra-ui/react';
import { SentimentOverTimeResult } from 'analysis/queries/SentimentOverTimeQuery';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { IconType } from 'react-icons';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { generateSampledPoints } from '../../utils/overTimeHelpers';
import { ShareModal } from '../Sharing/ShareModal';
import { GraphContainer } from './GraphContainer';

export function SentimentOverTimeChart({
  title,
  description,
  icon,
  filters,
}: {
  title: string;
  description?: string;
  icon: IconType;
  filters: SharedQueryFilters;
}) {
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

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
        d.positiveScore === 0 && d.negativeScore === 0
          ? 0.5
          : d.positiveScore / (d.positiveScore + Math.abs(d.negativeScore)),
      x: new Date(d.day).toLocaleDateString(),
      is_from_me: d.is_from_me,
    };
  });
  const receivedData = received.map((d) => {
    return {
      y:
        d.positiveScore === 0 && d.negativeScore === 0
          ? 0.5
          : d.positiveScore / (d.positiveScore + Math.abs(d.negativeScore)),
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

  const chartData = {
    labels,
    datasets: [
      {
        backgroundColor: theme.colors.green['200'],
        label: 'Sent Texts',
        borderColor: theme.colors.green['400'],
        borderWidth: 0.8,
        data: sampledSentData,
      },
      {
        backgroundColor: theme.colors.gray['200'],
        label: 'Received Texts',
        borderColor: theme.colors.gray['400'],
        borderWidth: 0.8,
        data: sampledReceivedData,
      },
    ],
  };

  const sharingLabel = isShareOpen
    ? {
        title: {
          display: true,
          text: `My ${title}`,
          font: {
            size: 18,
          },
        },
        subtitle: {
          display: true,
          text: 'Analyzed with https://leftonread.me/',
          padding: {
            bottom: 10,
          },
          font: {
            size: 12,
          },
        },
      }
    : {};

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
      // Disable ability to click on legend
      legend: {
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
          <Line ref={graphRefToShare} data={chartData} options={options} />
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
        isPremiumGraph
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
