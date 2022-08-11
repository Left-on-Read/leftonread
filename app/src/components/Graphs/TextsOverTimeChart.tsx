import { theme } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { TextOverTimeResults } from '../../analysis/queries/TextsOverTimeQuery';
import { GraphContainer } from './GraphContainer';

export function TextsOverTimeChart({
  title,
  description,
  filters,
}: {
  title: string;
  description: string;
  filters: SharedQueryFilters;
}) {
  const [sent, setSent] = useState<TextOverTimeResults>([]);
  const [received, setReceived] = useState<TextOverTimeResults>([]);

  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function fetchTextsOverTime() {
      try {
        const [textOverTimeDataListReceived, textOverTimeDataListSent] =
          await Promise.all([
            ipcRenderer.invoke('query-text-over-time-received', filters),
            ipcRenderer.invoke('query-text-over-time-sent', filters),
          ]);

        setSent(textOverTimeDataListSent);
        setReceived(textOverTimeDataListReceived);
        setSuccess(true);
      } catch (err) {
        setSuccess(false);
        log.error(`ERROR: fetching for ${title}`, err);
      }
    }
    fetchTextsOverTime();
  }, [filters, title]);

  if (!success) {
    return <div>Loading chart...</div>;
  }

  const labels = sent.map((d) => new Date(d.day).toLocaleDateString());

  const sentData = sent.map((d) => {
    return {
      y: d.count,
      x: new Date(d.day).toLocaleDateString(),
      is_from_me: d.is_from_me,
    };
  });
  const receivedData = received.map((d) => {
    return {
      y: d.count,
      x: new Date(d.day).toLocaleDateString(),
      is_from_me: d.is_from_me,
    };
  });

  const chartData = {
    labels,
    datasets: [
      {
        backgroundColor: theme.colors.green['200'],
        label: 'Received Texts',
        borderColor: theme.colors.green['400'],
        borderWidth: 1.2,
        data: receivedData,
        fill: true,
      },
      {
        backgroundColor: theme.colors.purple['200'],
        label: 'Sent Texts',
        borderColor: theme.colors.purple['400'],
        borderWidth: 1.2,
        data: sentData,
        fill: true,
      },
    ],
  };

  return (
    <GraphContainer title={title} description={description}>
      <Line data={chartData} />
    </GraphContainer>
  );
}
