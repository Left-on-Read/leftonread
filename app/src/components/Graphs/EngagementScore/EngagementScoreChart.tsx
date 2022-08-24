import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { EngagementResult } from 'analysis/queries/EngagementQueries';
import { SharedQueryFilters } from 'analysis/queries/filters/sharedQueryFilters';
import { TotalSentVsReceivedResults } from 'analysis/queries/TotalSentVsReceivedQuery';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import { IconType } from 'react-icons';

import { GraphContainer } from '../GraphContainer';
import { ESCards } from './ESCards';

const getValFromResult = (results: EngagementResult[], isSent: boolean) => {
  const list = results.filter((r) => r.isFromMe === (isSent ? 1 : 0));
  return list.length > 0 ? list[0].value : 1;
};

export function EngagementScoreChart({
  title,
  description,
  icon,
  filters,
}: {
  title: string;
  description?: string;
  icon: IconType;
  filters: SharedQueryFilters;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);

  const [avgLengthResults, setAvgLengthResults] = useState<EngagementResult[]>(
    []
  );
  const [doubleTextResults, setDoubleTextResults] = useState<
    EngagementResult[]
  >([]);
  const [leftonreadResults, setLeftonreadResults] = useState<
    EngagementResult[]
  >([]);
  const [avgDelayResults, setAvgDelayResults] = useState<EngagementResult[]>(
    []
  );

  const [totalSent, setTotalSent] = useState<number>(1);
  const [totalReceived, setTotalReceived] = useState<number>(1);

  useEffect(() => {
    async function fetchEngagementStats() {
      setIsLoading(true);
      setError(null);
      try {
        const [result1, result2, result3, result4, result5]: [
          EngagementResult[],
          EngagementResult[],
          EngagementResult[],
          EngagementResult[],
          TotalSentVsReceivedResults
        ] = await Promise.all([
          ipcRenderer.invoke('query-avg-length', filters),
          ipcRenderer.invoke('query-double-texts', filters),
          ipcRenderer.invoke('query-left-on-read', filters),
          ipcRenderer.invoke('query-average-delay-v2', filters),
          ipcRenderer.invoke('query-total-sent-vs-received', filters),
        ]);

        setAvgLengthResults(result1);
        setDoubleTextResults(result2);
        setLeftonreadResults(result3);
        setAvgDelayResults(result4);

        const receivedList = result5.filter((obj) => obj.is_from_me === 0);
        const sentList = result5.filter((obj) => obj.is_from_me === 1);

        if (receivedList.length === 1) {
          setTotalReceived(receivedList[0].total);
        }

        if (sentList.length === 1) {
          setTotalSent(sentList[0].total);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
        log.error(`ERROR: fetching for Engagement Stats`, err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEngagementStats();
  }, [filters]);

  // Calculate engagement...
  const calculateEngagement = () => {
    // Evaluate double-text score - want this as close to zero as possible
    const doubleTextDiff = Math.abs(
      getValFromResult(doubleTextResults, true) -
        getValFromResult(doubleTextResults, false)
    );

    const doubleTextScore = 1 - doubleTextDiff / (totalSent + totalReceived);

    // Evaluate left on read numbers. Ideally as low as possible, and as close to each other as possible
    const leftonReadDiff = Math.abs(
      getValFromResult(leftonreadResults, true) -
        getValFromResult(leftonreadResults, false)
    );

    const leftonReadTotal =
      getValFromResult(leftonreadResults, true) +
      getValFromResult(leftonreadResults, false);

    const leftonReadScore =
      (1 - leftonReadDiff / (totalSent + totalReceived)) *
      (1 - leftonReadTotal / (totalSent + totalReceived));

    // Evaluate message length. Ideally as high as possible and as close to each other as possible
    const avgLengthDiff = Math.abs(
      getValFromResult(avgLengthResults, true) -
        getValFromResult(avgLengthResults, false)
    );
    const avgLengthTotal =
      getValFromResult(avgLengthResults, true) +
      getValFromResult(avgLengthResults, false);

    const avgLengthScore =
      (1 - avgLengthDiff / (totalSent + totalReceived)) *
      (avgLengthTotal / (totalSent + totalReceived));

    // Evaluate average delay numbers. Ideally as low as possible, and as close to each other as possible
    const avgDelayDiff = Math.abs(
      getValFromResult(avgDelayResults, true) -
        getValFromResult(avgDelayResults, false)
    );

    const avgDelayTotal =
      getValFromResult(avgDelayResults, true) +
      getValFromResult(avgDelayResults, false);

    const avgDelayScore =
      (1 - avgDelayDiff / (totalSent + totalReceived)) *
      (1 - avgDelayTotal / (totalSent + totalReceived));

    return (
      2 * doubleTextScore +
      leftonReadScore +
      3 * avgLengthScore +
      3 * avgDelayScore
    );
  };

  const engagementScore = calculateEngagement();

  return (
    <GraphContainer title={title} description={description} icon={icon}>
      <div style={{ display: 'flex', marginTop: 25 }}>
        <Stat>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <Text
                bgGradient="linear(to-br, #7928CA, #FF0080)"
                bgClip="text"
                fontSize="6xl"
                fontWeight="extrabold"
              >
                {engagementScore.toLocaleString()}
              </Text>
            </div>
            <div style={{ marginLeft: 16 }}>
              <Text>
                <StatArrow type="increase" />
                9.05%
              </Text>
              <Text fontSize="sm" color="gray">
                compared to overall
              </Text>
            </div>
          </div>
        </Stat>
        <div style={{ width: '60%' }}>
          <ESCards
            avgLengthResults={avgLengthResults}
            doubleTextResults={doubleTextResults}
            leftonreadResults={leftonreadResults}
            avgDelayResults={avgDelayResults}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </GraphContainer>
  );
}
