import { Spinner } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { IconType } from 'react-icons';

import { GroupChatByFriends } from '../../../analysis/queries/GroupChats/GroupChatByFriendsQuery';
import { ShareModal } from '../../Sharing/ShareModal';
import { GraphContainer } from '../GraphContainer';

function GroupChatByFriendsBody({
  title,
  isSharingVersion,
  setIsShareOpen,
  isLoading,
  isError,
  colorByContactName,
  groupChatByFriendsDataList,
}: {
  title: string[];
  isSharingVersion: boolean;
  setIsShareOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  isError: boolean;
  colorByContactName: Record<string, string>;
  groupChatByFriendsDataList: GroupChatByFriends[];
}) {
  const contactNames = groupChatByFriendsDataList.map(
    (obj) => obj.contact_name
  );

  // now, we need to get colors in order of labels
  const colorsArray: string[] = [];
  contactNames.forEach((v) => {
    colorsArray.push(colorByContactName[v]);
  });

  const MAX_LABEL_LENGTH = 18;
  const data = {
    labels: groupChatByFriendsDataList.map((obj) => {
      if (obj.contact_name.length > MAX_LABEL_LENGTH) {
        return `${obj.contact_name.substring(0, MAX_LABEL_LENGTH)}...`;
      }
      return obj.contact_name;
    }),
    datasets: [
      {
        label: 'Count',
        data: groupChatByFriendsDataList.map((obj) => obj.count),
        borderRadius: 5,
        backgroundColor: colorsArray,
      },
    ],
  };

  let longContactName = '';
  if (contactNames.length > 0) {
    const proposedLongContactName = contactNames.reduce((a, b) =>
      a.length > b.length ? a : b
    );
    if (proposedLongContactName.length > 10) {
      longContactName = proposedLongContactName;
    }
  }

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
      padding: {
        bottom: 45,
      },
    },
    datalabels: {
      display: isSharingVersion,
      font: {
        size: 14,
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
      ? {
          // This algorithm sucks and needs to be reworked
          yPaddingText: 120 + longContactName.length,
          yPaddingLogo: 100 + longContactName.length,
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
        grid: {
          display: !isSharingVersion,
        },
        ticks: {
          display: !isSharingVersion,
          precision: 0,
          font: {
            size: 14,
            family: 'Montserrat',
            fontWeight: 'light',
          },
        },
      },
      xAxis: {
        grid: {
          display: !isSharingVersion,
        },
        ticks: {
          precision: 0,
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
        display: false,
        // Disable ability to click on legend
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onClick: (_e: any) => null,
      },
      ...plugins,
    },
  };

  const graphRefToShare = useRef(null);
  const body = (
    <>
      {isError ? (
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
        title="Group Chat by Friends"
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

export function GroupChatByFriendsChart({
  title,
  icon,
  isLoading,
  isError,
  colorByContactName,
  groupChatByFriendsDataList,
}: {
  title: string[];
  icon: IconType;
  isLoading: boolean;
  isError: boolean;
  colorByContactName: Record<string, string>;
  groupChatByFriendsDataList: GroupChatByFriends[];
}) {
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  groupChatByFriendsDataList.sort((a, b) => b.count - a.count);
  return (
    <>
      {isShareOpen && (
        <GroupChatByFriendsBody
          title={title}
          isSharingVersion
          setIsShareOpen={setIsShareOpen}
          isLoading={isLoading}
          isError={isError}
          colorByContactName={colorByContactName}
          groupChatByFriendsDataList={groupChatByFriendsDataList}
        />
      )}
      <GraphContainer
        title={title}
        icon={icon}
        setIsShareOpen={setIsShareOpen}
        showGroupChatShareButton
      >
        <GroupChatByFriendsBody
          title={title}
          isSharingVersion={false}
          setIsShareOpen={setIsShareOpen}
          isLoading={isLoading}
          isError={isError}
          colorByContactName={colorByContactName}
          groupChatByFriendsDataList={groupChatByFriendsDataList}
        />
      </GraphContainer>
    </>
  );
}
