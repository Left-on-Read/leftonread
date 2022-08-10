import { Stat, StatGroup, StatLabel, StatNumber } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { TotalSentVsReceivedResults } from '../../analysis/queries/TotalSentVsReceivedQuery';
import { GraphContainer } from './GraphContainer';

export function SentVsReceivedChart({
  title,
  description,
  filters,
}: {
  title: string;
  description: string;
  filters: SharedQueryFilters;
}) {
  const [received, setReceived] = useState<number>();
  const [sent, setSent] = useState<number>();
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function fetchSentVsReceived() {
      try {
        const sentVsReceivedDataList: TotalSentVsReceivedResults =
          await ipcRenderer.invoke('query-total-sent-vs-received', filters);

        const receivedList = sentVsReceivedDataList.filter(
          (obj) => obj.is_from_me === 0
        );
        const sentList = sentVsReceivedDataList.filter(
          (obj) => obj.is_from_me === 1
        );

        if (receivedList.length === 1) {
          setReceived(receivedList[0].total);
        }

        if (sentList.length === 1) {
          setSent(sentList[0].total);
        }

        setSuccess(true);
      } catch (err) {
        setSuccess(false);
        log.error(`ERROR: fetching for ${title}`, err);
      }
    }
    fetchSentVsReceived();
  }, [filters, title]);

  if (!success) {
    return <div>Loading chart..</div>;
  }

  return (
    <GraphContainer title={title} description={description}>
      <StatGroup>
        <Stat>
          <StatLabel>Total</StatLabel>
          <StatNumber>
            {((received ?? 0) + (sent ?? 0)).toLocaleString()}
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Sent</StatLabel>
          <StatNumber>{sent?.toLocaleString()}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Received</StatLabel>
          <StatNumber>{received?.toLocaleString()}</StatNumber>
        </Stat>
      </StatGroup>
    </GraphContainer>
  );
}
