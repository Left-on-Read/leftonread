import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import { ChatTableNames } from '../../tables';
import * as chatBro from '../../chatBro';
import interpolateColors from '../../utils/colors';
import ChartLoader from '../loading/ChartLoader';

interface TopFriendsProps {
  db: sqlite3.Database;
  titleText: string;
  labelText: string;
  colorInterpolationFunc: (t: number) => string;
}

export default function TopFriendsChart(props: TopFriendsProps) {
  const { db, colorInterpolationFunc, titleText, labelText } = props;
  const [friends, setFriends] = useState<string[]>([]);
  const [count, setCount] = useState<number[]>([]);

  useEffect(() => {
    async function fetchTopFriends() {
      try {
        const topFriendsDataList = await chatBro.queryTopFriends(
          db,
          ChatTableNames.TOP_FRIENDS_TABLE
        );
        setFriends(topFriendsDataList.map((obj) => obj.friend));
        setCount(topFriendsDataList.map((obj) => obj.count));
      } catch (err) {
        log.error('ERROR fetchTopFriends', err);
      }
    }
    fetchTopFriends();
  }, []);

  const COLORS = interpolateColors(friends.length, colorInterpolationFunc);

  const data = {
    labels: friends,
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

  if (friends.length > 0) {
    return (
      <div>
        <Bar data={data} options={options} />
      </div>
    );
  }
  return <ChartLoader titleText={titleText} />
}
