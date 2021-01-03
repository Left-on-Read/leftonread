import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';

interface BarChartProps {
  db: sqlite3.Database;
  chartQuery: () => Promise<WordCountTypes.Results | TopFriendsTypes.Results>;
  titleText: string;
  subLabel: string;
  xAxisKey: string; // TODO: this should be a type from results
  stacked?: boolean;
  colorScale: {},
}

export default function BarChat(props: BarChartProps) {
  const {
    chartQuery,
    titleText,
    subLabel,
    xAxisKey,
    colorScale
  } = props;
  const [xAxisData, setXAxisData] = useState<string[]>([]);
  const [count, setCount] = useState<number[]>([]);

  useEffect(() => {
    async function fetchXAxisData() {
      try {
        const dataList = await chartQuery();
        setXAxisData((dataList as Array<WordCountTypes.ChartData|TopFriendsTypes.ChartData>).map((obj: { [x: string]: any; }) => obj[xAxisKey]));
        setCount((dataList as Array<WordCountTypes.ChartData|TopFriendsTypes.ChartData>).map((obj: { [x: string]: any; }) => obj["count"]));
      } catch (err) {
        log.error(`ERROR fetching ${titleText}`, err);
      }
    }
    fetchXAxisData();
  }, []);

  const COLORS = interpolateColors(
    xAxisData.length,
    colorScale
  );

  const data = {
    labels: xAxisData,
    datasets: [
      {
        label: subLabel,
        data: count,
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    title: {
      display: true,
      text: titleText,
    },
  };

  if (xAxisData.length > 0) {
    return (
      <div>
        <Bar data={data} options={options} />
      </div>
    );
  }
  return <div>Loading chart...</div>;
}
