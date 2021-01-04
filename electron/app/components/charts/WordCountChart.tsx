import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import { ChatTableNames } from '../../tables';
import * as chatBro from '../../chatBro';
import interpolateColors from '../../utils/colors';
import ChartLoader from '../loading/ChartLoader';

interface WordCountProps {
  db: sqlite3.Database;
  titleText: string;
  colorInterpolationFunc: (t: number) => string;
}

export default function WordCountChart(props: WordCountProps) {
  const { db, colorInterpolationFunc, titleText, labelText } = props;
  const [words, setWords] = useState<string[]>([]);
  const [count, setCount] = useState<number[]>([]);

  useEffect(() => {
    async function fetchWordData() {
      try {
        const wordCountDataList = await chatBro.queryWordCounts(
          db,
          ChatTableNames.WORD_TABLE,
          {
            isFromMe: true,
          }
        );
        setWords(wordCountDataList.map((obj) => obj.word));
        setCount(wordCountDataList.map((obj) => obj.count));
      } catch (err) {
        log.error('ERROR fetchWordData ', err);
      }
    }
    fetchWordData();
  }, []);

  const COLORS = interpolateColors(words.length, colorInterpolationFunc);

  const data = {
    labels: words,
    datasets: [
      {
        label: 'Count of Word',
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
