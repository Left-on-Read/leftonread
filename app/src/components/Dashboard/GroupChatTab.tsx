import { GroupChatByFriendsChart } from 'components/Graphs/GroupChatByFriendsChart';
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useRef, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import Select from 'react-select';

import { SharedQueryFilters } from '../../analysis/queries/filters/sharedQueryFilters';
import { GroupChatByFriends } from '../../analysis/queries/GroupChatByFriendsQuery';

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
          setGroupChatToFilterBy(gct[0].label);
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

  // Literally don't know why this React Select is so bonkers with its types.
  return (
    <>
      <Select
        value={groupChatToFilterBy}
        onChange={(selected) => {
          setGroupChatToFilterBy(selected.label);
        }}
        options={groupChatNames}
      />
      <GroupChatByFriendsChart
        title={`Who Texts the Most in ${groupChatToFilterBy}`}
        description=""
        icon={FiUsers}
        filters={{ ...filters, groupChatName: groupChatToFilterBy }}
      />
    </>
  );
}
