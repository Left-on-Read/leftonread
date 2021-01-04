import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import interpolateColors from '../../utils/colors';

interface BarChartProps {
  db: sqlite3.Database;
  chartQuery: () => Promise<WordCountTypes.Results | TopFriendsTypes.Results>;
  titleText: string;
  subLabel: string;
  /* TODO:
   * The *Axiskeys can only be
   * WordCountTypes.Result | TopFriendsTypes.Results
   */
  xAxisKey: string;
  yAxisKey: string;
  stacked?: boolean;
  colorInterpolationFunc: (t: number) => string;
}

export default function BarChat(props: BarChartProps) {
  const {
    chartQuery,
    titleText,
    subLabel,
    xAxisKey,
    yAxisKey,
    colorInterpolationFunc,
  } = props;
  const [xAxisData, setXAxisData] = useState<string[]>([]);
  const [yAxisData, setYAxisData] = useState<number[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const dataList = await chartQuery();
        setXAxisData(
          (dataList as Array<
            WordCountTypes.ChartData | TopFriendsTypes.ChartData
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          >).map((obj: { [x: string]: any }) => obj[xAxisKey])
        );
        setYAxisData(
          (dataList as Array<
            WordCountTypes.ChartData | TopFriendsTypes.ChartData
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          >).map((obj: { [x: string]: any }) => obj[yAxisKey])
        );
      } catch (err) {
        log.error(`ERROR fetching ${titleText}`, err);
      }
    }
    fetchData();
  }, []);

  const COLORS = interpolateColors(xAxisData.length, colorInterpolationFunc);

  const data = {
    labels: xAxisData,
    datasets: [
      {
        label: subLabel,
        data: yAxisData,
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
