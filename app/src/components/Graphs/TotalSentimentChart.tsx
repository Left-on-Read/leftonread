import {
  Box,
  Icon,
  Spinner,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
  theme as defaultTheme,
  Tooltip,
} from '@chakra-ui/react';
import { TotalSentimentResult } from 'analysis/queries/TotalSentimentQuery';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { FiInfo } from 'react-icons/fi';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { GraphContainer } from './GraphContainer';

const calculateSentimentPercentage = (result: TotalSentimentResult) => {
  if (result.positiveScore + Math.abs(result.negativeScore) === 0) {
    return 0.5;
  }

  return (
    result.positiveScore /
    (result.positiveScore + Math.abs(result.negativeScore))
  );
};

function ProgressBar({ percentage }: { percentage: number }) {
  const roundedPositivePercentage = Math.round(percentage * 100) / 100;
  const roundedNegativePercentage = Math.round(10000 - 100 * percentage) / 100;

  return (
    <Box
      style={{
        width: '100%',
        height: 45,
        border: `1px solid ${defaultTheme.colors.gray['300']}`,
        borderRadius: 10,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
      shadow="lg"
    >
      <Tooltip
        label={`Percent Negativity: ${roundedNegativePercentage}%`}
        placement="top-end"
      >
        <div
          className="negative-bar"
          style={{
            borderRadius: 8,
            backgroundColor: defaultTheme.colors.gray['200'],
            height: '100%',
            width: '100%',
            position: 'absolute',
          }}
        />
      </Tooltip>

      <Tooltip
        label={`Percent Positivity: ${roundedPositivePercentage}%`}
        placement="top"
      >
        <motion.div
          className="positive-bar"
          animate={{ width: `${percentage}%` }}
          style={{
            borderRadius: '8px 0 0 8px',
            backgroundColor: defaultTheme.colors.green['200'],
            height: '100%',
            position: 'absolute',
          }}
          transition={{ type: 'spring', stiffness: 100 }}
        />
      </Tooltip>

      <div
        style={{
          position: 'absolute',
          left: 0,
          padding: '0px 30px',
        }}
      >
        <StatNumber>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {roundedPositivePercentage}%{' '}
            {/* <Text fontSize={12} style={{ marginLeft: 8 }}>
              POSITIVITY
            </Text> */}
          </div>
        </StatNumber>
      </div>
    </Box>
  );
}

export function TotalSentimentChart({
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
  const [sentTotal, setSentTotal] = useState<TotalSentimentResult>({
    positiveScore: 0,
    negativeScore: 0,
    avgComparative: 0,
    is_from_me: 1,
  });
  const [receivedTotal, setReceivedTotal] = useState<TotalSentimentResult>({
    positiveScore: 0,
    negativeScore: 0,
    avgComparative: 0,
    is_from_me: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchTotalSentiment() {
      setError(null);
      setIsLoading(true);
      try {
        const totalSentimentData: TotalSentimentResult[] =
          await ipcRenderer.invoke('query-total-sentiment', filters);

        const receivedList = totalSentimentData.filter(
          (obj) => obj.is_from_me === 0
        );
        const sentList = totalSentimentData.filter(
          (obj) => obj.is_from_me === 1
        );

        if (sentList.length === 1) {
          setSentTotal(sentList[0]);
        }

        if (receivedList.length === 1) {
          setReceivedTotal(receivedList[0]);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
        log.error(`ERROR: fetching for ${title}`, err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTotalSentiment();
  }, [filters, title]);

  return (
    <GraphContainer
      isPremiumGraph
      title={title}
      description={description}
      icon={icon}
      tooltip={
        <Tooltip
          label="Positivity is calculated by comparing words and emojis against a list of words that have been rated for positivity and negativity"
          fontSize="md"
        >
          <span>
            <Icon as={FiInfo} color="gray.500" />
          </span>
        </Tooltip>
      }
    >
      {error ? (
        <Text color="red.400">Uh oh! Something went wrong.</Text>
      ) : (
        <div style={{ position: 'relative' }}>
          {isLoading && (
            <div
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                top: 0,
                left: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 2,
              }}
            >
              <Spinner color="purple.400" size="xl" />
            </div>
          )}
          <StatGroup
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              paddingRight: 250,
            }}
          >
            <Stat style={{ width: '100%' }}>
              <StatLabel style={{ marginBottom: 2 }}>Sent</StatLabel>
              <ProgressBar
                percentage={calculateSentimentPercentage(sentTotal) * 100}
              />
            </Stat>

            <Stat style={{ marginTop: 24, width: '100%' }}>
              <StatLabel style={{ marginBottom: 2 }}>Received</StatLabel>
              <ProgressBar
                percentage={calculateSentimentPercentage(receivedTotal) * 100}
              />
            </Stat>
          </StatGroup>
        </div>
      )}
    </GraphContainer>
  );
}
