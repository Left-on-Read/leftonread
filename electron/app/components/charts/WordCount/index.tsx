import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import * as sqlite3 from 'sqlite3';
import { getWordCount } from '../../../chatBro';

interface WordCountProps {
  db: sqlite3.Database;
}

const NEAREST_ROUND = 10;

function calcMin(dataList: Array<number>) {
  const n = Math.min(...dataList);
  const min = Math.floor(n / NEAREST_ROUND - 1) * NEAREST_ROUND;
  return min;
}

// TODO: add ability to filter, which will fetch from query
export default function WordCountChart(props: WordCountProps) {
  const { db } = props;
  const [words, setWords] = useState<string[]>([]);
  const [count, setCount] = useState<number[]>([]);
  const [min, setMin] = useState(0);

  useEffect(() => {
    async function fetchWordData() {
      try {
        const wordCountDataList = await getWordCount(db, 'word_table', {
          isFromMe: true,
        });
        console.log(wordCountDataList.map((obj) => obj.word));
        setWords(wordCountDataList.map((obj) => obj.word));
        setCount(wordCountDataList.map((obj) => obj.count));
        const newMin = calcMin(count);
        setMin(newMin > 0 ? newMin : 0);
      } catch (err) {
        console.log('ERROR fetching word count ', err);
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
    scales: {
      yAxes: [
        {
          ticks: {
            min,
          },
        },
      ],
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
