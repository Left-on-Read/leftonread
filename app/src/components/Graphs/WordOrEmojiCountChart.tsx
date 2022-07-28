import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import {
  IWordOrEmojiFilters,
  TWordOrEmojiResults,
} from '../../analysis/queries/WordOrEmojiQuery';
import { interpolateColors } from '../../utils/interpolateColors';

export function WordOrEmojiCountChart({
  titleText,
  labelText,
  filters,
  colorInterpolationFunc,
}: {
  titleText: string;
  labelText: string;
  filters: IWordOrEmojiFilters;
  colorInterpolationFunc: (t: number) => string;
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
        log.error(`ERROR: fetching for ${titleText}`, err);
      }
    }
    fetchWordData();
  }, [titleText, filters]);

  const COLORS = interpolateColors(words.length, colorInterpolationFunc);

  const data = {
    labels: words,
    datasets: [
      {
        label: labelText,
        data: count,
        backgroundColor: COLORS,
      },
    ],
  };

  const options = {
    // title: {
    //   display: true,
    //   text: titleText,
    // },
    // scales: {
    //   yAxes: [
    //     {
    //       ticks: {
    //         beginAtZero: true,
    //       },
    //     },
    //   ],
    // },
  };

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

  return <Bar data={data} options={options} />;
}
