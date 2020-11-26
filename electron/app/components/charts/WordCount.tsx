import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import * as chatBro from '../../chatBro';

interface WordCountProps {
  db: sqlite3.Database;
}

// TODO(Danilowicz): add ability to filter, which will fetch from query
export default function WordCountChart(props: WordCountProps) {
  const { db } = props;
  const [words, setWords] = useState<string[]>([]);
  const [count, setCount] = useState<number[]>([]);

  useEffect(() => {
    async function fetchWordData() {
      try {
        const wordCountDataList = await chatBro.queryWordCounts(
          db,
          chatBro.TableNames.WORD_TABLE,
          {
            isFromMe: true,
          }
        );
        setWords(wordCountDataList.map((obj) => obj.word));
        setCount(wordCountDataList.map((obj) => obj.count));
      } catch (err) {
        log.error('ERROR fetching word count ', err);
      }
    }
    fetchWordData();
  }, []);

  const data = {
    labels: words,
    datasets: [
      {
        label: 'Count of Word',
        data: count,
        // TODO(Chan): this should all live in constants
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    title: {
      display: true,
      text: 'Top Words Sent',
    },
  };

  if (words.length > 0) {
    return (
      <div>
        <Bar data={data} options={options} />
      </div>
    );
  }
  return <div>Loading chart...</div>;
}
