import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Skeleton,
  Stat,
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
  title: string[];
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
    const doubleTextTotal = Math.abs(
      getValFromResult(doubleTextResults, true) +
        getValFromResult(doubleTextResults, false)
    );

    // Less than 80% of your texts should be double texts
    const doubleTextScore = Math.max(
      0.8 - doubleTextTotal / (totalSent + totalReceived),
      0
    );

    // Evaluate left on read numbers. Ideally as low as possible, and as close to each other as possible
    const leftonReadDiff = Math.abs(
      getValFromResult(leftonreadResults, true) -
        getValFromResult(leftonreadResults, false)
    );

    const leftonReadTotal =
      getValFromResult(leftonreadResults, true) +
      getValFromResult(leftonreadResults, false);

    // You should be responding to 50% of your texts
    const leftonReadScore = Math.max(
      0.5 - leftonReadTotal / (totalSent + totalReceived),
      0
    );

    // Evaluate message length. Ideally as high as possible and as close to each other as possible
    const avgLengthDiff = Math.abs(
      getValFromResult(avgLengthResults, true) -
        getValFromResult(avgLengthResults, false)
    );
    const avgLengthTotal =
      getValFromResult(avgLengthResults, true) +
      getValFromResult(avgLengthResults, false);

    // 100 characters is a very good score
    const avgLengthScore =
      Math.min(Math.max(avgLengthTotal - 40 - avgLengthDiff, 0), 100) / 100;

    // Evaluate average delay numbers. Ideally as low as possible, and as close to each other as possible
    const avgDelayDiff = Math.abs(
      getValFromResult(avgDelayResults, true) -
        getValFromResult(avgDelayResults, false)
    );

    const avgDelayTotal =
      getValFromResult(avgDelayResults, true) +
      getValFromResult(avgDelayResults, false);

    const avgDelayScore = Math.min(
      Math.max(1 - (avgDelayTotal + avgDelayDiff) / (5 * 24 * 60), 0),
      1
    );

    return {
      total:
        (doubleTextScore +
          2 * leftonReadScore +
          avgLengthScore +
          3 * avgDelayScore) /
        7,
      doubleTextScore,
      leftonReadScore,
      avgLengthScore,
      avgDelayScore,
    };
  };

  const {
    total,
    doubleTextScore,
    leftonReadScore,
    avgLengthScore,
    avgDelayScore,
  } = calculateEngagement();

  return (
    <GraphContainer title={title} description={description} icon={icon}>
      <div style={{ display: 'flex', marginTop: 25 }}>
        <Stat>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', marginTop: -36 }}
            >
              {isLoading ? (
                <div style={{ padding: 28 }}>
                  <Skeleton height={79} width={36} />
                </div>
              ) : (
                <Text
                  bgGradient="linear(to-br, #7928CA, #FF0080)"
                  bgClip="text"
                  fontSize={88}
                  fontWeight="extrabold"
                >
                  {Math.round(total * 100).toLocaleString()}
                </Text>
              )}
              <Text
                style={{ marginLeft: 12, paddingTop: 44 }}
                fontWeight="extrabold"
                fontSize={18}
                color="gray"
              >
                / 100
              </Text>
            </div>

            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <Text color="gray" fontWeight="bold" fontSize="12">
                    See Score Breakdown
                  </Text>
                  <AccordionIcon color="gray" fontSize="14" />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Text fontSize="12" color="gray">
                    <Text style={{ display: 'flex' }}>
                      Double Text Score:{' '}
                      {isLoading ? (
                        <Skeleton
                          height={5}
                          width={6}
                          style={{ marginLeft: 4 }}
                        />
                      ) : (
                        <span style={{ fontWeight: 'bold', marginLeft: 4 }}>
                          {Math.round(doubleTextScore * 100)}
                        </span>
                      )}
                    </Text>
                    <Text style={{ display: 'flex' }}>
                      Left on Read Score:{' '}
                      {isLoading ? (
                        <Skeleton
                          height={5}
                          width={6}
                          style={{ marginLeft: 4 }}
                        />
                      ) : (
                        <span style={{ fontWeight: 'bold', marginLeft: 4 }}>
                          {Math.round(avgLengthScore * 100)}
                        </span>
                      )}
                    </Text>
                    <Text style={{ display: 'flex' }}>
                      Avg Msg Length Score:{' '}
                      {isLoading ? (
                        <Skeleton
                          height={5}
                          width={6}
                          style={{ marginLeft: 4 }}
                        />
                      ) : (
                        <span style={{ fontWeight: 'bold', marginLeft: 4 }}>
                          {Math.round(avgLengthScore * 100)}
                        </span>
                      )}
                    </Text>
                    <Text style={{ display: 'flex' }}>
                      Avg Response Time Score:{' '}
                      {isLoading ? (
                        <Skeleton
                          height={5}
                          width={6}
                          style={{ marginLeft: 4 }}
                        />
                      ) : (
                        <span style={{ fontWeight: 'bold', marginLeft: 4 }}>
                          {Math.round(avgDelayScore * 100)}
                        </span>
                      )}
                    </Text>
                  </Text>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </div>
        </Stat>
        <div style={{ width: '60%', marginLeft: 48 }}>
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
