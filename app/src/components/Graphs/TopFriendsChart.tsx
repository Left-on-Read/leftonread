import { theme as defaultTheme } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { TTopFriendsResults } from '../../analysis/queries/TopFriendsQuery';
import { GraphContainer } from './GraphContainer';

export function TopFriendsChart({
  title,
  description,
  filters,
}: {
  title: string;
  description: string;
  filters: SharedQueryFilters;
}) {
  const [friends, setFriends] = useState<string[]>([]);
  const [received, setReceived] = useState<number[]>([]);
  const [sent, setSent] = useState<number[]>([]);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function fetchTopFriends() {
      try {
        const topFriendsDataList: TTopFriendsResults = await ipcRenderer.invoke(
          'query-top-friends',
          filters
        );
        setFriends(topFriendsDataList.map((obj) => obj.friend));
        setSent(topFriendsDataList.map((obj) => obj.sent));
        setReceived(topFriendsDataList.map((obj) => obj.received));
        setSuccess(true);
      } catch (err) {
        setSuccess(false);
        log.error(`ERROR: fetching for ${title}`, err);
      }
    }
    fetchTopFriends();
  }, [filters, title]);

  const data = {
    labels: friends,
    datasets: [
      {
        label: 'Received',
        data: received,
        backgroundColor: defaultTheme.colors.pink['200'],
      },
      {
        label: 'Sent',
        data: sent,
        backgroundColor: defaultTheme.colors.cyan['200'],
      },
    ],
  };

  if (!success) {
    return <div>Loading chart..</div>;
  }

  return (
    <GraphContainer title={title} description={description}>
      <Bar data={data} />
    </GraphContainer>
  );
}
