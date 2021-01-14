import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import * as chatBro from '../../chatBro';
import interpolateColors from '../../utils/colors';
import ChartLoader from '../loading/ChartLoader';

interface WordOrEmojiCountProps {
  db: sqlite3.Database;
  titleText: string;
  labelText: string;
  isEmoji: boolean;
  colorInterpolationFunc: (t: number) => string;
}

export default function WordOrEmojiCountChart(props: WordOrEmojiCountProps) {
  const { db, colorInterpolationFunc, titleText, labelText, isEmoji } = props;
  const [words, setWords] = useState<string[]>([]);
  const [count, setCount] = useState<number[]>([]);

  useEffect(() => {
    async function fetchWordData() {
      try {
        const data = await chatBro.queryEmojiOrWordCounts(db, {
          isEmoji,
          isFromMe: true,
        });
        setWords(data.map((obj) => obj.word));
        setCount(data.map((obj) => obj.count));
      } catch (err) {
        log.error(`ERROR fetching for component for ${titleText}`, err);
      }
    }
    fetchWordData();
  }, []);

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
    title: {
      display: true,
      text: titleText,
    },
  };

  if (words.length > 0) {
    return (
      <div>
        <Bar data={data} options={options} />
      </div>
    );
  }
  return <ChartLoader titleText={titleText} />;
}
