import { Text } from '@chakra-ui/react';
import { GraphContainerLoading } from 'components/Loaders/GraphContainerLoading';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { createColorByContact } from 'main/util';
import { useEffect, useState } from 'react';
import { FiCompass, FiFeather } from 'react-icons/fi';
import Select from 'react-select';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { GroupChatByFriends } from '../../analysis/queries/GroupChats/GroupChatByFriendsQuery';
import { GroupChatActivityOverTimeChart } from '../Graphs/GroupChats/GroupChatActivityOverTimeChart';
import { GroupChatByFriendsChart } from '../Graphs/GroupChats/GroupChatByFriendsChart';
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

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  const [colorByContactName, setColorByContactName] = useState<
    Record<string, string>
  >({});

  const [data, setData] = useState<GroupChatByFriends[]>([]);

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
      setError(null);
      setIsLoading(true);
      try {
        // TODO: Seperate, fastest query to get all group chat names
        // Order by most texted and those with display names
        const groupChatByFriendsDataList: GroupChatByFriends[] =
          await ipcRenderer.invoke('query-group-chat-by-friends', filters);

        setData(groupChatByFriendsDataList);

        const setGct = [
          ...new Set(
            groupChatByFriendsDataList.map((obj) => obj.group_chat_name)
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
          setError(err.message);
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
        icon={FiFeather}
        filters={{ ...filters, groupChatName: selectedGroupChat.value }}
      />

      <GroupChatReactionsChart
        title={['Who Gives the Most Reactions in ', selectedGroupChat.label]}
        icon={FiCompass}
        filters={{ ...filters, groupChatName: selectedGroupChat.value }}
        mode="GIVES"
        colorByContactName={colorByContactName}
      />

      <GroupChatReactionsChart
        title={['Who Gets the Most Reactions in ', selectedGroupChat.label]}
        icon={FiCompass}
        filters={{ ...filters, groupChatName: selectedGroupChat.value }}
        mode="GETS"
        colorByContactName={colorByContactName}
      />

      <GroupChatActivityOverTimeChart
        title={['Group Chat Activity in ', selectedGroupChat.label]}
        description=""
        icon={FiCompass}
        filters={{ ...filters, groupChatName: selectedGroupChat.value }}
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
      {error ? <Text color="red.400">Uh oh! Something went wrong.</Text> : null}
      {isLoading ? <GraphContainerLoading /> : body}
    </>
  );
}
