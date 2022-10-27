import { Text } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import {
  FiActivity,
  FiAward,
  FiCalendar,
  FiFeather,
  FiGift,
} from 'react-icons/fi';
import Select from 'react-select';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { GroupChatByFriends } from '../../analysis/queries/GroupChats/GroupChatByFriendsQuery';
import { createColorByContact } from '../../main/util';
import { GroupChatActivityOverTimeChart } from '../Graphs/GroupChats/GroupChatActivityOverTimeChart';
import { GroupChatByFriendsChart } from '../Graphs/GroupChats/GroupChatByFriendsChart';
import { GroupChatFunniestMessage } from '../Graphs/GroupChats/GroupChatFunniestMessage';
import { GroupChatReactionsChart } from '../Graphs/GroupChats/GroupChatReactionsChart';

export function GroupChatTab({ filters }: { filters: SharedQueryFilters }) {
  const [groupChatNames, setGroupChatNames] = useState<
    { value: string; label: string }[]
  >([]);

  const [selectedGroupChat, setSelectedGroupChat] = useState<{
    value: string;
    label: string;
  }>({
    value: '',
    label: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [colorByContactName, setColorByContactName] = useState<
    Record<string, string>
  >({});

  const [data, setData] = useState<GroupChatByFriends[]>([]);

  const [isError, setIsError] = useState<boolean>(false);

  const handleGroupChatSelection = (
    fullDataSet: GroupChatByFriends[],
    newGroupChatObj: {
      value: string;
      label: string;
    }
  ) => {
    setSelectedGroupChat(newGroupChatObj);
    const contactsInGivenGroupChat = fullDataSet
      .filter((d) => d.group_chat_name === newGroupChatObj.value)
      .map((v) => v.contact_name);
    const colorCreation = createColorByContact(contactsInGivenGroupChat);
    setColorByContactName(colorCreation);
  };

  useEffect(() => {
    async function fetchGroupChatByFriends() {
      setIsLoading(true);
      try {
        const groupChatByFriendsDataList: GroupChatByFriends[] =
          await ipcRenderer.invoke(
            'query-group-chat-by-friends',
            filters,
            'DATE'
          );
        setData(groupChatByFriendsDataList);

        const setGct = [
          ...new Set(
            groupChatByFriendsDataList.map((obj) => {
              return obj.group_chat_name;
            })
          ),
        ];

        const gct = setGct.map((name) => {
          return { value: name, label: name.replaceAll(',', ', ') };
        });

        setGroupChatNames(gct);
        if (gct.length > 0) {
          handleGroupChatSelection(groupChatByFriendsDataList, {
            value: gct[0].value,
            label: gct[0].label,
          });
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setIsLoading(false);
          setIsError(true);
        }
        log.error(`ERROR: fetching group chat names`, err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGroupChatByFriends();
    // do not run the effect with data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const body = (
    <>
      <GroupChatByFriendsChart
        title={['Who Texts the Most in ', selectedGroupChat.label]}
        colorByContactName={colorByContactName}
        icon={FiActivity}
        groupChatByFriendsDataList={data.filter(
          (v) => v.group_chat_name === selectedGroupChat.value
        )}
        isLoading={isLoading}
        isError={isError}
      />

      <GroupChatFunniestMessage
        filters={{ ...filters, groupChatName: selectedGroupChat.value }}
      />

      <GroupChatReactionsChart
        title={['Who Gives the Most Reactions in ', selectedGroupChat.label]}
        icon={FiGift}
        filters={{ ...filters, groupChatName: selectedGroupChat.value }}
        mode="GIVES"
        colorByContactName={colorByContactName}
        isPremiumGraph
      />

      <GroupChatReactionsChart
        title={['Who Gets the Most Reactions in ', selectedGroupChat.label]}
        icon={FiAward}
        filters={{ ...filters, groupChatName: selectedGroupChat.value }}
        mode="GETS"
        colorByContactName={colorByContactName}
        isPremiumGraph
      />

      <GroupChatActivityOverTimeChart
        title={['Group Chat Activity in ', selectedGroupChat.label]}
        description=""
        icon={FiCalendar}
        filters={{ ...filters, groupChatName: selectedGroupChat.value }}
        colorByContactName={colorByContactName}
        isPremiumGraph
      />
    </>
  );

  // TODO(Daniowicz): Use async select to load options in
  // Also this Group Chat Selector UI should be totally redone and moved into the filter panel
  return (
    <>
      <div style={{ marginBottom: '48px', maxWidth: '450px' }}>
        <Text fontSize="xl" fontWeight={600} style={{ marginBottom: '6px' }}>
          Select a Group Chat
        </Text>
        <Select
          value={selectedGroupChat}
          onChange={(newValue) => {
            if (newValue) {
              handleGroupChatSelection(data, newValue);
            }
          }}
          options={groupChatNames}
        />
      </div>
      {isLoading ? (
        <GroupChatByFriendsChart
          title={['Who Texts the Most in ', selectedGroupChat.label]}
          colorByContactName={colorByContactName}
          icon={FiFeather}
          groupChatByFriendsDataList={data.filter(
            (v) => v.group_chat_name === selectedGroupChat.value
          )}
          isLoading={isLoading}
          isError={isError}
        />
      ) : (
        body
      )}
    </>
  );
}
