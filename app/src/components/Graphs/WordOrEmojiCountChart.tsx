import { Input, Spinner, theme } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { IconType } from 'react-icons';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { TWordOrEmojiResults } from '../../analysis/queries/WordOrEmojiQuery';
import { useGoldContext } from '../Premium/GoldContext';
import { ShareModal } from '../Sharing/ShareModal';
import { GraphContainer } from './GraphContainer';

function WordOrEmojiCountBody({
  title,
  labelText,
  filters,
  isEmoji,
  isFromMe,
  isSharingVersion,
  setIsShareOpen,
}: {
  title: string[];
  labelText: string;
  filters: SharedQueryFilters;
  isEmoji: boolean;
  isFromMe: boolean;
  isSharingVersion: boolean;
  setIsShareOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [words, setWords] = useState<string[]>([]);
  const [count, setCount] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchWordData() {
      setIsLoading(true);
      setError(null);
      try {
        const data: TWordOrEmojiResults = await ipcRenderer.invoke(
          'query-word-emoji',
          { ...filters, isEmoji, isFromMe, limit: isSharingVersion ? 5 : 10 }
        );
        setWords(data.map((obj) => obj.word));
        setCount(data.map((obj) => obj.count));
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
        log.error(`ERROR: fetching for ${title}`, err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWordData();
  }, [filters, title, isEmoji, isFromMe, isSharingVersion]);

  const data = {
    labels: words,
    datasets: [
      {
        label: labelText,
        data: count,
        borderRadius: 8,
        gradient: {
          backgroundColor: {
            axis: 'y' as const,
            colors: {
              0: theme.colors.blue[300],
              [count[0]]: theme.colors.purple[400],
            },
          },
        },
      },
    ],
  };

  const plugins = {
    title: {
      display: isSharingVersion,
      text: title,
      font: {
        size: 20,
        family: 'Montserrat',
        fontWeight: 'light',
      },
    },
    datalabels: {
      display: isSharingVersion,
      font: {
        size: 18,
        family: 'Montserrat',
        fontWeight: 'light',
      },
      anchor: 'end' as const,
      align: 'end' as const,
      formatter(value: any) {
        return `${value}`;
      },
    },
    'lor-chartjs-logo-watermark-plugin': isSharingVersion
      ? { yPaddingLogo: 25, yPaddingText: 40 }
      : false,
  };

  const chartStyle: React.CSSProperties = isSharingVersion
    ? { width: '500px', height: '500px' }
    : {};

  const options = {
    indexAxis: isSharingVersion ? ('y' as const) : undefined,
    maintainAspectRatio: isSharingVersion ? false : undefined,
    layout: isSharingVersion
      ? {
          padding: {
            bottom: 65,
            left: 40,
            right: 40,
            top: 25,
          },
        }
      : {},
    scales: isSharingVersion
      ? {
          yAxis: {
            grid: {
              display: false,
            },
            ticks: {
              precision: 0,
              font: {
                size: 20,
                family: 'Montserrat',
                fontWeight: 'light',
              },
            },
          },
          xAxis: {
            grid: {
              display: false,
            },
            ticks: {
              precision: 0,
              font: { size: 0 },
            },
          },
        }
      : {
          yAxis: {
            ticks: {
              precision: 0,
              font: {
                size: 16,
                family: 'Montserrat',
                fontWeight: 'light',
              },
            },
          },
          xAxis: {
            ticks: {
              precision: 0,
              font: {
                size: isEmoji ? 20 : 16,
                family: 'Montserrat',
                fontWeight: 'light',
              },
            },
          },
        },
    plugins: {
      legend: {
        // Disable ability to click on legend
        display: false,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onClick: (_e: any) => null,
      },
      ...plugins,
    },
  };

  const graphRefToShare = useRef(null);
  const body = (
    <>
      {error ? (
        // <div
        //   style={{
        //     display: 'flex',
        //     justifyContent: 'center',
        //     alignItems: 'center',
        //   }}
        // >
        //   <div style={{ position: 'absolute' }}>
        //     <Text color="red.400">Uh oh! Something went wrong... </Text>
        //   </div>
        <Bar data={{ labels: [], datasets: [] }} />
      ) : (
        <>
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
              }}
            >
              <Spinner color="purple.400" size="xl" />
            </div>
          )}
          <div style={chartStyle}>
            <Bar data={data} options={options} ref={graphRefToShare} />
          </div>
        </>
      )}
    </>
  );

  if (isSharingVersion) {
    return (
      <ShareModal
        isOpen={isSharingVersion}
        onClose={() => setIsShareOpen(false)}
        graphRefToShare={graphRefToShare}
        title={title.join(', ')}
        contacts={
          filters.contact?.length === 1
            ? filters.contact?.map((c) => c.value)
            : undefined
        }
      >
        {body}
      </ShareModal>
    );
  }
  return body;
}

export function WordOrEmojiCountChart({
  title,
  description,
  icon,
  labelText,
  filters,
  isEmoji,
  isFromMe,
  isPremiumGraph,
}: {
  title: string[];
  description: string;
  icon: IconType;
  labelText: string;
  filters: SharedQueryFilters;
  isEmoji: boolean;
  isFromMe: boolean;
  isPremiumGraph?: boolean;
}) {
  const { isPremium } = useGoldContext();
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [value, setValue] = useState('');
  const handleChange = (event: any) => setValue(event.target.value);

  const f = { ...filters, word: value };
  const placeholder = `${!isPremium ? 'Unlock gold to s' : 'S'}earch for any ${
    isEmoji ? 'emoji, such as 🚀' : 'word'
  }...`;
  return (
    <>
      {isShareOpen && (
        <WordOrEmojiCountBody
          title={value ? title.concat(`filtering by "${value}"`) : title}
          labelText={labelText}
          filters={f}
          isEmoji={isEmoji}
          isFromMe={isFromMe}
          isSharingVersion
          setIsShareOpen={setIsShareOpen}
        />
      )}
      <GraphContainer
        title={title}
        description={description}
        icon={icon}
        isPremiumGraph={!!isPremiumGraph}
        setIsShareOpen={setIsShareOpen}
      >
        <Input
          isDisabled={!isPremium}
          width="70%"
          placeholder={placeholder}
          mb={3}
          value={value}
          onChange={handleChange}
        />
        <WordOrEmojiCountBody
          title={title}
          labelText={labelText}
          filters={f}
          isEmoji={isEmoji}
          isFromMe={isFromMe}
          isSharingVersion={false}
          setIsShareOpen={setIsShareOpen}
        />
      </GraphContainer>
    </>
  );
}
