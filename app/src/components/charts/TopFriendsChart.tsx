import log from 'electron-log';
import React, { useEffect, useState } from 'react';
import * as sqlite3 from 'sqlite3';

import * as chatBro from '../../chatBro';
import interpolateColors from '../../utils/colors';
import { BarChartWrapper } from '../shared';
import { ITopFriendsFilters } from '../../chatBro/queries/TopFriends/types';

interface TopFriendsProps {
  db: sqlite3.Database;
  titleText: string;
  filters: ITopFriendsFilters;
  colorInterpolationFunc: (t: number) => string;
}

export default function TopFriendsChart(props: TopFriendsProps) {
  const { db, colorInterpolationFunc, titleText, filters } = props;
  const [friends, setFriends] = useState<string[]>([]);
  const [received, setReceived] = useState<number[]>([]);
  const [sent, setSent] = useState<number[]>([]);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function fetchTopFriends() {
      try {
        const topFriendsDataList = await chatBro.queryTopFriends(db, filters);
        setFriends(topFriendsDataList.map((obj) => obj.friend));
        setSent(topFriendsDataList.map((obj) => obj.sent));
        setReceived(topFriendsDataList.map((obj) => obj.received));
        setSuccess(true);
      } catch (err) {
        setSuccess(false);
        log.error(`ERROR: fetching for ${titleText}`, err);
      }
    }
    fetchTopFriends();
  }, [db, filters, titleText]);

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
      labels={friends}
      options={options}
      titleText={titleText}
      success={success}
    />
  );
}
