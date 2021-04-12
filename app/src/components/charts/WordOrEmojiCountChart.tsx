import React, { useState, useEffect } from 'react';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import * as chatBro from '../../chatBro';
import interpolateColors from '../../utils/colors';
import { BarChartWrapper } from '../shared';

interface WordOrEmojiCountProps {
  db: sqlite3.Database;
  titleText: string;
  labelText: string;
  filters: WordOrEmojiTypes.Filters;
  colorInterpolationFunc: (t: number) => string;
}

export default function WordOrEmojiCountChart(props: WordOrEmojiCountProps) {
  const { db, colorInterpolationFunc, titleText, labelText, filters } = props;
  const [words, setWords] = useState<string[]>([]);
  const [count, setCount] = useState<number[]>([]);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function fetchWordData() {
      try {
        const data = await chatBro.queryEmojiOrWordCounts(db, filters);
        setSuccess(true);
        setWords(data.map((obj) => obj.word));
        setCount(data.map((obj) => obj.count));
      } catch (err) {
        setSuccess(false);
        log.error(`ERROR: fetching for ${titleText}`, err);
      }
    }
    fetchWordData();
  }, [db, titleText, filters]);

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
    title: { display: true,
      text: titleText,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <BarChartWrapper
      data={data}
      labels={words}
      options={options}
      titleText={titleText}
      success={success}
    />
  );
}
