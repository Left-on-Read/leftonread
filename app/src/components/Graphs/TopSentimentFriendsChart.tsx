import { Spinner, Text, theme as defaultTheme } from '@chakra-ui/react';
import { TopSentimentFriendsResult } from 'analysis/queries/TopSentimentFriendsQuery';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { IconType } from 'react-icons';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { ShareModal } from '../Sharing/ShareModal';
import { GraphContainer } from './GraphContainer';

function TopSentimentFriendsBody({
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
        const topFriendsDataList: TopSentimentFriendsResult[] =
          await ipcRenderer.invoke('query-top-sentiment-friends', {
            ...filters,
            limit: isSharingVersion ? 5 : 10,
          });

        setFriends(topFriendsDataList.map((obj) => obj.friend));
        setSent(topFriendsDataList.map((obj) => obj.sentPct * 100));
        setReceived(topFriendsDataList.map((obj) => obj.receivedPct * 100));
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
        label: 'Sent Positivity %',
        data: sent,
        backgroundColor: defaultTheme.colors.green['200'],
        borderColor: defaultTheme.colors.green['500'],
        borderRadius: 5,
      },
      {
        label: 'Received Positivity %',
        data: received,
        backgroundColor: defaultTheme.colors.gray['200'],
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
    datalabels: { display: false },
    'lor-chartjs-logo-watermark-plugin': isSharingVersion
      ? {
          yPaddingText: 97,
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
            family: 'Montserrat',
            fontWeight: 'light',
          },
        },
      },
      xAxis: {
        ticks: {
          precision: 0,
          font: {
            family: 'Montserrat',
            fontWeight: 'light',
            size: 14,
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
            <Bar data={data} options={options} ref={graphRefToShare} />
          </div>
        </>
      )}
    </>
  );

  if (isSharingVersion) {
    return (
      <ShareModal
        title="Top Friends Sentiment"
        isOpen={isSharingVersion}
        onClose={() => setIsShareOpen(false)}
        graphRefToShare={graphRefToShare}
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

export function TopSentimentFriendsChart({
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
        <TopSentimentFriendsBody
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
      >
        <TopSentimentFriendsBody
          title={title}
          filters={filters}
          isSharingVersion={false}
          setIsShareOpen={setIsShareOpen}
        />
      </GraphContainer>
    </>
  );
}
