import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import * as chatBro from '../../chatBro';
import interpolateColors from '../../utils/colors';
import ChartLoader from '../loading/ChartLoader';

interface TopFriendsProps {
  db: sqlite3.Database;
  titleText: string;
  colorInterpolationFunc: (t: number) => string;
}

export default function TopFriendsChart(props: TopFriendsProps) {
  const { db, colorInterpolationFunc, titleText } = props;
  const [friends, setFriends] = useState<string[]>([]);
  const [received, setReceived] = useState<number[]>([]);
  const [sent, setSent] = useState<number[]>([]);

  useEffect(() => {
    async function fetchTopFriends() {
      try {
        const topFriendsDataList = await chatBro.queryTopFriends(db);
        setFriends(topFriendsDataList.map((obj) => obj.friend));
        setSent(topFriendsDataList.map((obj) => obj.sent));
        setReceived(topFriendsDataList.map((obj) => obj.received));
      } catch (err) {
        log.error('ERROR fetchTopFriends', err);
      }
    }
    fetchTopFriends();
  }, []);

  // use COLOR_RANGE param to create two distinct colors on the scale
  const SENT_COLORS = interpolateColors(
    friends.length,
    colorInterpolationFunc,
    {
      colorStart: 0.5,
      colorEnd: 0.5,
      useEndAsStart: false,
    }
  );
  const RECEIVED_COLORS = interpolateColors(
    friends.length,
    colorInterpolationFunc,
    {
      colorStart: 0.7,
      colorEnd: 0.7,
      useEndAsStart: false,
    }
  );

  const data = {
    labels: friends,
    datasets: [
      {
        label: 'Received',
        data: received,
        backgroundColor: RECEIVED_COLORS,
      },
      {
        label: 'Sent',
        data: sent,
        backgroundColor: SENT_COLORS,
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
  return <ChartLoader titleText={titleText} />;
}
