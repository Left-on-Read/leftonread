import { Text } from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import Select, { GroupBase, OptionsOrGroups } from 'react-select';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { GroupChatByFriends } from '../../analysis/queries/GroupChatByFriendsQuery';
import { GroupChatActivityOverTimeChart } from '../Graphs/GroupChats/GroupChatActivityOverTimeChart';
import { GroupChatByFriendsChart } from '../Graphs/GroupChats/GroupChatByFriendsChart';

export function GroupChatTab({ filters }: { filters: SharedQueryFilters }) {
  const [groupChatToFilterBy, setGroupChatToFilterBy] = useState<string>('');

  const [groupChatNames, setGroupChatNames] = useState<
    { value: string; label: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

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
          return { value: name, label: name.replace(',', ', ') };
        });

        setGroupChatNames(gct);
        if (gct.length > 0) {
          setGroupChatToFilterBy(gct[0].value);
        }
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

  // Use async select to load options in
  return (
    <>
      <Text fontSize="sm" fontWeight={600}>
        Select a group chat:
      </Text>
      <Select
        value={groupChatToFilterBy}
        onChange={(selected) => {
          if (selected) {
            // Literally don't know why this React Select is so bonkers with its types.
            // @ts-ignore. Label does exist.
            setGroupChatToFilterBy(selected.value);
          }
        }}
        options={
          groupChatNames as unknown as
            | OptionsOrGroups<string, GroupBase<string>>
            | undefined
        }
      />
      {/* NOTE(Danilowicz): Not proud of the .replace here... */}
      <GroupChatActivityOverTimeChart
        title={`Group Chat Activity in ${groupChatToFilterBy.replace(
          ',',
          ', '
        )}`}
        description=""
        icon={FiUsers}
        filters={{ ...filters, groupChatName: groupChatToFilterBy }}
      />
      <GroupChatByFriendsChart
        title={`Who Texts the Most in ${groupChatToFilterBy.replace(
          ',',
          ', '
        )}`}
        icon={FiUsers}
        filters={{ ...filters, groupChatName: groupChatToFilterBy }}
      />
    </>
  );
}
