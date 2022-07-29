import { theme } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import {
  IWordOrEmojiFilters,
  TWordOrEmojiResults,
} from '../../analysis/queries/WordOrEmojiQuery';
import { GraphContainer } from './GraphContainer';

export function WordOrEmojiCountChart({
  title,
  description,
  labelText,
  filters,
}: {
  title: string;
  description: string;
  labelText: string;
  filters: IWordOrEmojiFilters;
}) {
  const [words, setWords] = useState<string[]>([]);
  const [count, setCount] = useState<number[]>([]);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function fetchWordData() {
      try {
        const data: TWordOrEmojiResults = await ipcRenderer.invoke(
          'query-word-emoji',
          filters
        );
        setSuccess(true);
        setWords(data.map((obj) => obj.word));
        setCount(data.map((obj) => obj.count));
      } catch (err) {
        setSuccess(false);
        log.error(`ERROR: fetching for ${title}`, err);
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
        backgroundColor: theme.colors.green['200'],
      },
    ],
  };

  const options = {};

  let label = '';
  if (filters.isFromMe) {
    if (filters.isEmoji) {
      label = 'EMOJI_COUNT_SENT';
    } else {
      label = 'WORD_COUNT_SENT';
    }
  } else if (filters.isEmoji) {
    label = 'EMOJI_COUNT_RECEIVED';
  } else {
    label = 'WORD_COUNT_RECEIVED';
  }

  // return (
  //   <BarChartWrapper
  //     data={data}
  //     labels={words}
  //     options={options}
  //     titleText={titleText}
  //     success={success}
  //   />
  // );

  if (!success) {
    return <div> Loading Chart...</div>;
  }

  return (
    <GraphContainer title={title} description={description}>
      <Bar data={data} options={options} />
    </GraphContainer>
  );
}
