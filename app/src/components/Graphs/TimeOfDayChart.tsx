import { Spinner, Text, theme, Tooltip } from '@chakra-ui/react';
import colorInterpolate from 'color-interpolate';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { IconType } from 'react-icons';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { TimeOfDayResults } from '../../analysis/queries/TimeOfDayQuery';
import { GraphContainer } from './GraphContainer';

const assertTwoDigits = (num: number) => {
  if (num < 10) {
    return `0${num}`;
  }

  return `${num}`;
};

function TimeOfDayVisualizer({
  sentData,
  receivedData,
}: {
  sentData: TimeOfDayResults;
  receivedData: TimeOfDayResults;
}) {
  const START_COLOR = theme.colors.gray['200'];
  const END_COLOR = theme.colors.blue['400'];
  const colorMap = colorInterpolate([START_COLOR, END_COLOR]);

  const maxSent = Math.max(...sentData.map((point) => point.count));
  const maxReceived = Math.max(...receivedData.map((point) => point.count));

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        marginBottom: 60,
        marginTop: 30,
      }}
    >
      <div
        style={{
          marginTop: 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Text>Sent</Text>
        <Text style={{ marginTop: 8 }}>Received</Text>
      </div>
      <div style={{ marginLeft: 25, width: '100%' }}>
        <div
          style={{
            height: 25,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Text fontSize="sm">12:00am</Text>
          <Text fontSize="sm">12:00pm</Text>
          <Text fontSize="sm">11:59pm</Text>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          {sentData.map((point) => (
            <Tooltip
              key={`sent-${point.hour}`}
              label={`${point.hour}:00 - ${point.count} messages`}
              hasArrow
              placement="top"
            >
              <motion.div
                animate={{
                  backgroundColor:
                    point.count === 0
                      ? START_COLOR
                      : colorMap(point.count / maxSent),
                }}
                style={{
                  width: `${100 / 24 - 0.5}%`,
                  height: 15,
                }}
                className="border-hoverable"
              />
            </Tooltip>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 18,
          }}
        >
          {receivedData.map((point) => (
            <Tooltip
              key={`received-${point.hour}`}
              label={`${point.hour}:00 - ${point.count} messages`}
              hasArrow
              placement="bottom"
            >
              <motion.div
                animate={{
                  backgroundColor:
                    point.count === 0
                      ? START_COLOR
                      : colorMap(point.count / maxReceived),
                }}
                style={{
                  width: `${100 / 24 - 0.5}%`,
                  height: 15,
                }}
                className="border-hoverable"
              />
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}

const DEFAULT_DATA: TimeOfDayResults = new Array(24).fill(0).map((_, i) => ({
  hour: i,
  is_from_me: 0,
  count: 0,
}));

export function TimeOfDayChart({
  title,
  description,
  icon,
  filters,
}: {
  title: string[];
  description: string;
  icon: IconType;
  filters: SharedQueryFilters;
}) {
  const [sent, setSent] = useState<TimeOfDayResults>(DEFAULT_DATA);
  const [received, setReceived] = useState<TimeOfDayResults>(DEFAULT_DATA);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchTimeOfDay() {
      setIsLoading(true);
      setError(null);
      try {
        let [timeOfDayReceived, timeOfDaySent]: [
          TimeOfDayResults,
          TimeOfDayResults
        ] = await Promise.all([
          ipcRenderer.invoke('query-time-of-day-received', filters),
          ipcRenderer.invoke('query-time-of-day-sent', filters),
        ]);

        if (!timeOfDayReceived || timeOfDayReceived.length === 0) {
          timeOfDayReceived = DEFAULT_DATA;
        }

        if (!timeOfDaySent || timeOfDaySent.length === 0) {
          timeOfDaySent = DEFAULT_DATA;
        }

        // Assert that all hours are covered...
        for (let i = 0; i < 24; i += 1) {
          if (`${timeOfDayReceived[i].hour}` !== assertTwoDigits(i)) {
            timeOfDayReceived.splice(i, 0, {
              hour: i,
              is_from_me: 0,
              count: 0,
            });
          }

          if (`${timeOfDaySent[i].hour}` !== assertTwoDigits(i)) {
            timeOfDaySent.splice(i, 0, {
              hour: i,
              is_from_me: 0,
              count: 0,
            });
          }
        }

        setSent(timeOfDaySent);
        setReceived(timeOfDayReceived);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
        log.error(`ERROR: fetching for ${title}`, err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTimeOfDay();
  }, [title, filters]);

  return (
    <GraphContainer title={title} description={description} icon={icon}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {error ? (
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 50,
              width: '100%',
            }}
          >
            <div style={{ position: 'absolute' }}>
              <Text color="red.400">Uh oh! Something went wrong... </Text>
            </div>
          </div>
        ) : (
          <>
            {isLoading && (
              <div style={{ position: 'absolute' }}>
                <Spinner color="purple.400" size="xl" />
              </div>
            )}
            <TimeOfDayVisualizer sentData={sent} receivedData={received} />
          </>
        )}
      </div>
    </GraphContainer>
  );
}
