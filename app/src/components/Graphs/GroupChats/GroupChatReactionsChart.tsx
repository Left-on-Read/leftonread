/* eslint-disable @typescript-eslint/naming-convention */
import { Icon, Spinner, Tooltip } from '@chakra-ui/react';
import { Context } from 'chartjs-plugin-datalabels';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { IconType } from 'react-icons';
import { FiInfo } from 'react-icons/fi';

import { SharedGroupChatTabQueryFilters } from '../../../analysis/queries/filters/sharedGroupChatTabFilters';
import { GroupChatReactions } from '../../../analysis/queries/GroupChats/GroupChatReactionsQuery';
import { ShareModal } from '../../Sharing/ShareModal';
import { GraphContainer } from '../GraphContainer';

function GroupChatReactionsBody({
  title,
  filters,
  isSharingVersion,
  setIsShareOpen,
  loadingOverride,
  mode,
  colorByContactName,
}: {
  title: string[];
  filters: SharedGroupChatTabQueryFilters;
  isSharingVersion: boolean;
  setIsShareOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadingOverride?: boolean;
  mode: 'GIVES' | 'GETS';
  colorByContactName: Record<string, string>;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  const [chartData, setChartData] = useState<GroupChatReactions[]>([]);
  const [reactionsSet, setReactionsSet] = useState(
    new Set([
      'Loved',
      'Liked',
      'Disliked',
      'Laughed',
      'Questioned',
      'Emphasized',
    ])
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
        // We can and should move this filtering entirely to SQL
        const groupChatReactionsDataList =
          groupChatReactionsDataListUnfiltered.filter((o) => {
            if (mode === 'GIVES') {
              return parseInt(o.is_giving_reaction, 10) === 1;
            }
            return parseInt(o.is_giving_reaction, 10) === 0;
          });

        setChartData(groupChatReactionsDataList);

        const setOfReactions = new Set<string>();
        // might be faster to run a SQL distinct here
        groupChatReactionsDataList.forEach((obj) => {
          setOfReactions.add(obj.reaction);
        });
        setReactionsSet(setOfReactions);
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
  }, [filters, title, mode]);

  const datasetByContactName: Record<
    string,
    {
      label: string;
      data: (number | null)[];
      borderRadius: number;
      backgroundColor: string;
    }
  > = {};
  chartData.forEach((obj) => {
    const { contact_name } = obj;

    if (!(contact_name in datasetByContactName)) {
      const contactArray = chartData.filter(
        (d) => d.contact_name === contact_name
      );

      const orderedDataArray: (number | null)[] = [];
      Array.from(reactionsSet).forEach((r) => {
        const foundValue = contactArray.find((cData) => cData.reaction === r);
        orderedDataArray.push(foundValue?.count ?? null);
      });

      datasetByContactName[contact_name] = {
        label: contact_name,
        data: orderedDataArray,
        borderRadius: 5,
        backgroundColor: colorByContactName[contact_name],
      };
    }
  });

  const data = {
    labels: Array.from(reactionsSet).map((r) => {
      if (mode === 'GETS') {
        if (r === 'Laughed') {
          return 'Laughs';
        }
        if (r === 'Emphasized' || r === 'Emphasised') {
          return 'Emphasis';
        }
        if (r === 'Questioned') {
          return 'Questions';
        }
        return r.replace('d', 's');
      }
      return r;
    }),
    datasets: Object.values(datasetByContactName),
  };

  // You want to go off of the group chat name, and not the number of contacts
  // because you want to use the group chat name if it exists
  let titleLabel = title;
  if (title && title.length > 1 && title[1].length > 25) {
    titleLabel = [title[0], ...title[1].split(', ')];
  }

  const plugins = {
    title: {
      display: isSharingVersion,
      text: titleLabel,
      font: {
        size: 20,
        family: 'Montserrat',
        fontWeight: 'light',
      },
    },
    datalabels: !isSharingVersion
      ? {
          font: {
            size: 12,
            family: 'Montserrat',
            fontWeight: 'light',
          },
          clamp: true,
          anchor: 'start' as const,
          align: 'start' as const,
          rotation: Object.keys(colorByContactName).length < 5 ? 320 : 270,
          formatter(value: any, context: Context) {
            if (!value) {
              return '';
            }
            const MAX_LABEL_LENGTH = 8;
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
    ? { width: '500px', height: '500px' }
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
          display: true,
        },
        ticks: {
          precision: 0,
          padding: !isSharingVersion ? 65 : 0,
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
        // <div
        //   style={{
        //     position: 'relative',
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
        title={`Group Chat Reactions ${mode}`}
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
  mode,
  colorByContactName,
  isPremiumGraph,
}: {
  title: string[];
  icon: IconType;
  filters: SharedGroupChatTabQueryFilters;
  loadingOverride?: boolean;
  mode: 'GIVES' | 'GETS';
  colorByContactName: Record<string, string>;
  isPremiumGraph?: boolean;
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
          mode={mode}
          colorByContactName={colorByContactName}
        />
      )}
      <GraphContainer
        title={title}
        icon={icon}
        setIsShareOpen={setIsShareOpen}
        showGroupChatShareButton
        isPremiumGraph={!!isPremiumGraph}
        description={`Who ${mode.toLocaleLowerCase()} the most hahas, loves, likes, dislikes...`}
        tooltip={
          <Tooltip
            label="Reactions were added in iOS 10 in September 2016. If nothing is showing, your group chat may be too old."
            fontSize="md"
          >
            <span>
              <Icon as={FiInfo} color="gray.500" />
            </span>
          </Tooltip>
        }
      >
        <GroupChatReactionsBody
          title={title}
          filters={filters}
          isSharingVersion={false}
          setIsShareOpen={setIsShareOpen}
          loadingOverride={loadingOverride}
          mode={mode}
          colorByContactName={colorByContactName}
        />
      </GraphContainer>
    </>
  );
}
