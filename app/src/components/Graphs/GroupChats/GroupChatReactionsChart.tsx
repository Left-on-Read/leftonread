import { Spinner, Text, theme as defaultTheme } from '@chakra-ui/react';
import { GroupChatReactions } from 'analysis/queries/GroupChats/GroupChatReactionsQuery';
import { Context } from 'chartjs-plugin-datalabels';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { IconType } from 'react-icons';

import { SharedGroupChatTabQueryFilters } from '../../../analysis/queries/filters/sharedGroupChatTabFilters';
import { ShareModal } from '../../Sharing/ShareModal';
import { GraphContainer } from '../GraphContainer';

function GroupChatReactionsBody({
  title,
  filters,
  isSharingVersion,
  setIsShareOpen,
  loadingOverride,
}: {
  title: string[];
  filters: SharedGroupChatTabQueryFilters;
  isSharingVersion: boolean;
  setIsShareOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadingOverride?: boolean;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  //   const [count, setCount] = useState<number[]>([]);
  //   const [contactNames, setContactNames] = useState<string[]>([]);

  const [chartData, setChartData] = useState<GroupChatReactions[]>([]);
  const [reactionsSet, setReactionsSet] = useState(
    new Set(['Love', 'Like', 'Dislike', 'Haha', 'Questioned', 'Emphasized'])
  );

  useEffect(() => {
    async function fetchGroupChatReactions() {
      setError(null);
      setIsLoading(true);
      try {
        const groupChatReactionsDataListUnfiltered: GroupChatReactions[] =
          await ipcRenderer.invoke('query-group-chat-reactions', filters);

        // NOTE(Danilowicz): Lot of potiential here.
        // Could show who gives who the most reactions, who gives the most, etc
        const groupChatReactionsDataList =
          groupChatReactionsDataListUnfiltered.filter((o) =>
            parseInt(o.is_giving_reaction, 10)
          );

        setChartData(groupChatReactionsDataList);

        const setOfReactions = new Set<string>();
        groupChatReactionsDataList.forEach((obj) => {
          setOfReactions.add(obj.reaction);
        });
        setReactionsSet(setOfReactions);

        // const MAX_LABEL_LENGTH = 18;
        // const cn = groupChatReactionsDataList.map((obj) => {
        //   if (obj.contact_name.length > MAX_LABEL_LENGTH) {
        //     return `${obj.contact_name.substring(0, MAX_LABEL_LENGTH)}...`;
        //   }
        //   return obj.contact_name;
        // });
        // const ct = groupChatReactionsDataList.map((obj) => obj.count);

        // setContactNames(cn);
        // setCount(ct);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
        log.error(`ERROR: fetching for ${title}`, err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGroupChatReactions();
  }, [filters, title]);

  const data = {
    labels: Array.from(reactionsSet),
    // TODO(Danilowicz):
    // 1) create object of datasetByContactName
    // 2) that object must have ordered number of reactions
    // ^- mark as null if needed
    // 3) Give each person a different color
    datasets: [
      {
        label: 'Teddy',
        data: [null, 6, 7, 8],
        borderRadius: 5,
        backgroundColor: defaultTheme.colors.purple['200'],
        borderColor: defaultTheme.colors.purple['400'],
      },
      {
        label: 'Jackie',
        data: [5, 10, 7, 8],
        borderRadius: 5,
        backgroundColor: defaultTheme.colors.blue['200'],
        borderColor: defaultTheme.colors.blue['400'],
      },
      {
        label: 'Brian',
        data: [9, 4, 7, 8],
        borderRadius: 5,
        backgroundColor: defaultTheme.colors.green['200'],
        borderColor: defaultTheme.colors.green['400'],
      },
      {
        label: 'You',
        data: [5, 6, 7, 8],
        borderRadius: 5,
        backgroundColor: defaultTheme.colors.pink['200'],
        borderColor: defaultTheme.colors.pink['400'],
      },
      {
        label: 'Andrew',
        data: [2, null, 7, 8],
        borderRadius: 5,
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
    datalabels: !isSharingVersion
      ? {
          font: {
            size: isSharingVersion ? 12 : 12,
            family: 'Montserrat',
            fontWeight: 'light',
          },
          clamp: true,
          anchor: 'start' as const,
          align: 'start' as const,
          rotation: 320,
          //   padding: {
          //     bottom: 45,
          //   },
          formatter(value: any, context: Context) {
            const MAX_LABEL_LENGTH = 18;
            if (
              context.dataset.label &&
              context.dataset.label.length > MAX_LABEL_LENGTH
            ) {
              return `${context.dataset.label.substring(
                0,
                MAX_LABEL_LENGTH
              )}...`;
            }
            return context.dataset.label;
          },
        }
      : { display: false },
    'lor-chartjs-logo-watermark-plugin': isSharingVersion
      ? {
          yPaddingText: 80,
          yPaddingLogo: 65,
        }
      : false,
  };

  const chartStyle: React.CSSProperties = isSharingVersion
    ? { width: '400px', height: '500px' }
    : {};

  const options = {
    maintainAspectRatio: isSharingVersion ? false : undefined,
    layout: isSharingVersion
      ? {
          padding: {
            bottom: 65,
            left: 35,
            right: 35,
            top: 25,
          },
        }
      : {},
    scales: {
      yAxis: {
        // stacked: true,
        grid: {
          display: !isSharingVersion,
        },
        ticks: {
          display: true,
          precision: 0,
          font: {
            size: 14,
            family: 'Montserrat',
            fontWeight: 'light',
          },
        },
      },
      xAxis: {
        // stacked: true,
        grid: {
          display: !isSharingVersion,
        },
        ticks: {
          precision: 0,
          padding: !isSharingVersion ? 45 : 0,
          font: {
            size: 14,
            family: 'Montserrat',
            fontWeight: 'light',
          },
        },
      },
    },
    plugins: {
      legend: {
        display: isSharingVersion,
        // Disable ability to click on legend
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onClick: (_e: any) => null,
        labels: {
          font: {
            family: 'Montserrat',
            fontWeight: 'light',
            size: 14,
          },
        },
      },
      ...plugins,
    },
  };

  const showLoading = loadingOverride || isLoading;
  const graphRefToShare = useRef(null);
  const body = (
    <>
      {error ? (
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'absolute' }}>
            <Text color="red.400">Uh oh! Something went wrong... </Text>
          </div>
          <Bar data={{ labels: [], datasets: [] }} />
        </div>
      ) : (
        <>
          {showLoading && (
            <div style={{ position: 'relative' }}>
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
      >
        {body}
      </ShareModal>
    );
  }
  return body;
}

export function GroupChatReactionsChart({
  title,
  icon,
  filters,
  loadingOverride,
}: {
  title: string[];
  icon: IconType;
  filters: SharedGroupChatTabQueryFilters;
  loadingOverride?: boolean;
}) {
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  return (
    <>
      {isShareOpen && (
        <GroupChatReactionsBody
          title={title}
          filters={filters}
          isSharingVersion
          setIsShareOpen={setIsShareOpen}
          loadingOverride={loadingOverride}
        />
      )}
      <GraphContainer title={title} icon={icon} setIsShareOpen={setIsShareOpen}>
        <GroupChatReactionsBody
          title={title}
          filters={filters}
          isSharingVersion={false}
          setIsShareOpen={setIsShareOpen}
          loadingOverride={loadingOverride}
        />
      </GraphContainer>
    </>
  );
}
