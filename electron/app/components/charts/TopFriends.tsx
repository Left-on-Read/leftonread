import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import * as sqlite3 from 'sqlite3';
import log from 'electron-log';
import { ChatTableNames } from '../../tables';
import * as chatBro from '../../chatBro';

interface TopFriendsProps {
  db: sqlite3.Database;
}

export default function TopFriendsChart(props: TopFriendsProps) {
  const { db } = props;
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
        log.error('ERROR fetching top friends ', err);
      }
    }
    fetchTopFriends();
  }, []);

  const data = {
    labels: friends,
    datasets: [
      {
        label: 'Count of texts',
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
      text: 'Top Friends',
    },
  };

  if (friends.length > 0) {
    return (
      <div>
        <Bar data={data} options={options} />
      </div>
    );
  }
  return <div>Loading chart...</div>;
}
