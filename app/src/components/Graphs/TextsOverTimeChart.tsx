import { Spinner, Text, theme } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { IconType } from 'react-icons';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { TextOverTimeResults } from '../../analysis/queries/TextsOverTimeQuery';
import { GraphContainer } from './GraphContainer';

export function TextsOverTimeChart({
  title,
  description,
  icon,
  filters,
}: {
  title: string;
  description: string;
  icon: IconType;
  filters: SharedQueryFilters;
}) {
  const [sent, setSent] = useState<TextOverTimeResults>([]);
  const [received, setReceived] = useState<TextOverTimeResults>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchTextsOverTime() {
      setIsLoading(true);
      setError(null);
      try {
        const [textOverTimeDataListReceived, textOverTimeDataListSent] =
          await Promise.all([
            ipcRenderer.invoke('query-text-over-time-received', filters),
            ipcRenderer.invoke('query-text-over-time-sent', filters),
          ]);

        setSent(textOverTimeDataListSent);
        setReceived(textOverTimeDataListReceived);
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
      y: d.count,
      x: new Date(d.day).toLocaleDateString(),
      is_from_me: d.is_from_me,
    };
  });
  const receivedData = received.map((d) => {
    return {
      y: d.count,
      x: new Date(d.day).toLocaleDateString(),
      is_from_me: d.is_from_me,
    };
  });

  const chartData = {
    labels,
    datasets: [
      {
        backgroundColor: theme.colors.gray['200'],
        label: 'Received Texts',
        borderColor: theme.colors.gray['400'],
        borderWidth: 0.8,
        data: receivedData,
      },
      {
        backgroundColor: theme.colors.blue['200'],
        label: 'Sent Texts',
        borderColor: theme.colors.blue['400'],
        borderWidth: 0.8,
        data: sentData,
      },
    ],
  };

  const options = {
    // plugins: {
    //   // 'legend' now within object 'plugins {}'
    //   legend: {
    //     labels: {
    //       borderColor: 'red',
    //       // fontSize: 18  // not 'fontSize:' anymore
    //       font: {
    //         size: 18, // 'size' now within object 'font {}'
    //       },
    //     },
    //   },
    // },
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
  };

  let graphContent = <Line data={chartData} options={options} />;
  if (isLoading) {
    graphContent = (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'absolute' }}>
          <Spinner color="purple.400" size="xl" />
        </div>
        <Line data={{ labels: [], datasets: [] }} options={options} />
      </div>
    );
  } else if (error) {
    graphContent = (
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
    );
  }

  return (
    <GraphContainer title={title} description={description} icon={icon}>
      {graphContent}
    </GraphContainer>
  );
}
