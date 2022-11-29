import { Icon, Spinner, theme, Tooltip } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { IconType } from 'react-icons';
import { FiInfo } from 'react-icons/fi';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { FriendsOverTimeResult } from '../../analysis/queries/FriendsOverTimeQuery';
import { useGlobalContext } from '../Dashboard/GlobalContext';
import { ShareModal } from '../Sharing/ShareModal';
import { GraphContainer } from './GraphContainer';

function FriendsOverTimeBody({
  title,
  filters,
  isSharingVersion,
  setIsShareOpen,
  contactNamesToCompare,
}: {
  title: string[];
  filters: SharedQueryFilters;
  isSharingVersion: boolean;
  setIsShareOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contactNamesToCompare: string[];
}) {
  const emptyRows = new Array(contactNamesToCompare.length).fill([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const [data, setData] = useState<FriendsOverTimeResult[][]>(emptyRows);

  useEffect(() => {
    async function fetchFriendsOverTimeChart() {
      setIsLoading(true);
      setError(null);
      try {
        const promises: Promise<FriendsOverTimeResult[]>[] =
          contactNamesToCompare.map((c) => {
            return ipcRenderer.invoke('query-friends-over-time', c);
          });

        const results = await Promise.all(promises);
        setData(results);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
        log.error(`ERROR: fetching for ${title}`, err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFriendsOverTimeChart();
  }, [filters, title, contactNamesToCompare]);

  const { red, blue, green, yellow, orange } = theme.colors;
  const colors = [red, blue, green, yellow, orange];
  const datasets = data.map((dataset, i) => {
    return {
      backgroundColor: colors[i]['300'],
      label: data[i][0] ? data[i][0].contactName : '',
      borderColor: colors[i]['500'],
      borderWidth: 0.8,
      data: data[i].map((v) => v.count),
    };
  });

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
    // TODO(Danilowicz)
    'lor-chartjs-logo-watermark-plugin': isSharingVersion
      ? {
          yPaddingText: 122,
          yPaddingLogo: 110,
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
            return new Date(
              data[0].map((v) => v.date)[value]
            ).toLocaleDateString();
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
            <Line
              data={{
                labels: data[0].map((v) => v.date),
                datasets,
              }}
              options={options}
              ref={graphRefToShare}
            />
          </div>
        </>
      )}
    </>
  );

  if (isSharingVersion) {
    return (
      <ShareModal
        title="Friends Over Time"
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

export function FriendsOverTimeChart({
  title,
  description,
  icon,
  filters,
}: {
  title: string[];
  description: string;
  icon: IconType;
  filters: SharedQueryFilters;
}) {
  const MAX_DATASETS = 5;
  const { contacts } = useGlobalContext();
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const contactNamesToCompare =
    contacts && contacts.length > 0
      ? contacts.slice(0, MAX_DATASETS).map((c) => c.value)
      : [''];
  return (
    <>
      {isShareOpen && (
        <FriendsOverTimeBody
          title={title}
          filters={filters}
          isSharingVersion
          setIsShareOpen={setIsShareOpen}
          contactNamesToCompare={contactNamesToCompare}
        />
      )}
      <GraphContainer
        title={title}
        description={description}
        icon={icon}
        setIsShareOpen={setIsShareOpen}
        tooltip={
          <Tooltip
            label="Filtering for this chart is coming soon! If you see a large gap in data, this might be because your iMessage app has iCloud syncing turned on."
            fontSize="md"
          >
            <span>
              <Icon as={FiInfo} color="gray.500" />
            </span>
          </Tooltip>
        }
        isPremiumGraph
      >
        <FriendsOverTimeBody
          title={title}
          filters={filters}
          isSharingVersion={false}
          setIsShareOpen={setIsShareOpen}
          contactNamesToCompare={contactNamesToCompare}
        />
      </GraphContainer>
    </>
  );
}
