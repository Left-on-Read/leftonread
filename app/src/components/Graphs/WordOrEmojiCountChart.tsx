import { Spinner, Text, theme } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { IconType } from 'react-icons';

import {
  IWordOrEmojiFilters,
  TWordOrEmojiResults,
} from '../../analysis/queries/WordOrEmojiQuery';
import { GraphContainer } from './GraphContainer';

export function WordOrEmojiCountChart({
  title,
  description,
  icon,
  labelText,
  filters,
}: {
  title: string;
  description: string;
  icon: IconType;
  labelText: string;
  filters: IWordOrEmojiFilters;
}) {
  const [words, setWords] = useState<string[]>([]);
  const [count, setCount] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchWordData() {
      setIsLoading(true);
      setError(null);
      try {
        const data: TWordOrEmojiResults = await ipcRenderer.invoke(
          'query-word-emoji',
          filters
        );
        setWords(data.map((obj) => obj.word));
        setCount(data.map((obj) => obj.count));
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
        log.error(`ERROR: fetching for ${title}`, err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWordData();
  }, [title, filters]);

  const data = {
    labels: words,
    datasets: [
      {
        label: labelText,
        data: count,
        backgroundColor: theme.colors.blue['200'],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    scales: {
      yAxis: {
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <GraphContainer title={title} description={description} icon={icon}>
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
          <Bar data={data} options={options} />
        </div>
      )}
    </GraphContainer>
  );
}
