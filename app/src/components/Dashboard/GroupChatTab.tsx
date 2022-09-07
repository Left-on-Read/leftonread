import { Skeleton, Text } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import { FiCompass, FiFeather } from 'react-icons/fi';
import Select from 'react-select';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { GroupChatByFriends } from '../../analysis/queries/GroupChats/GroupChatByFriendsQuery';
import { getRandomColorFromTheme } from '../../main/util';
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

  useEffect(() => {
    async function fetchGroupChatByFriends() {
      setError(null);
      setIsLoading(true);
      try {
        // TODO: Seperate, fastest query to get all group chat names
        // Order by most texted and those with display names
        const groupChatByFriendsDataList: GroupChatByFriends[] =
          await ipcRenderer.invoke('query-group-chat-by-friends', filters);

        const setGct = [
          ...new Set(
            groupChatByFriendsDataList.map((obj) => obj.group_chat_name)
          ),
        ];

        const gct = setGct.map((name) => {
          return { value: name, label: name };
        });

        setGroupChatNames(gct);
        if (gct.length > 0) {
          setSelectedGroupChat({ value: gct[0].value, label: gct[0].value });
        }

        const tmpColorByContactName: Record<string, string> = {};
        groupChatByFriendsDataList.forEach((o) => {
          if (!(o.contact_name in tmpColorByContactName)) {
            // eslint-disable-next-line prefer-destructuring
            tmpColorByContactName[o.contact_name] = getRandomColorFromTheme();
          }
        });

        setColorByContactName(tmpColorByContactName);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
        log.error(`ERROR: fetching group chat names`, err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGroupChatByFriends();
  }, [filters]);

  const body = (
    <>
      {/* NOTE(Danilowicz): Not proud of the replace all here... */}
      <GroupChatByFriendsChart
        title={[
          'Who Texts the Most in ',
          ...selectedGroupChat.label.replaceAll(',', ', ;').split(';'),
        ]}
        icon={FiFeather}
        filters={{ ...filters, groupChatName: selectedGroupChat.label }}
        colorByContactName={colorByContactName}
      />

      <GroupChatReactionsChart
        title={[
          'Who Gives the Most Reactions in ',
          ...selectedGroupChat.label.replaceAll(',', ', ;').split(';'),
        ]}
        icon={FiCompass}
        filters={{ ...filters, groupChatName: selectedGroupChat.label }}
        mode="GIVES"
        colorByContactName={colorByContactName}
      />

      <GroupChatReactionsChart
        title={[
          'Who Gets the Most Reactions in ',
          ...selectedGroupChat.label.replaceAll(',', ', ;').split(';'),
        ]}
        icon={FiCompass}
        filters={{ ...filters, groupChatName: selectedGroupChat.label }}
        mode="GETS"
        colorByContactName={colorByContactName}
      />

      <GroupChatActivityOverTimeChart
        title={[
          'Group Chat Activity in ',
          ...selectedGroupChat.label.replaceAll(',', ', ;').split(';'),
        ]}
        description=""
        icon={FiCompass}
        filters={{ ...filters, groupChatName: selectedGroupChat.label }}
      />
    </>
  );

  // TODO(Daniowicz): Use async select to load options in
  // Also this Group Chat Selector UI should be totally redone and moved into the filter panel
  return (
    <>
      <div
        style={{ padding: '0px 48px', marginBottom: '48px', maxWidth: '450px' }}
      >
        <Text fontSize="xl" fontWeight={600} style={{ marginBottom: '6px' }}>
          Select a Group Chat
        </Text>
        <Select
          value={selectedGroupChat}
          onChange={(newValue) => {
            if (newValue) {
              setSelectedGroupChat(newValue);
            }
          }}
          options={groupChatNames}
        />
      </div>
      {isLoading ? <Skeleton height={8} width={180} /> : body}
    </>
  );
}
