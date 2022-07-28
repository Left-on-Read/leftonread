import React from 'react';

import { GroupChatFilters } from '../../constants/filters';

interface GroupChatFilterProps {
  groupChat: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function GroupChatFilter(props: GroupChatFilterProps) {
  const { groupChat, handleChange } = props;

  return (
    <>
      {Object.values(GroupChatFilters).map((filterOpt) => {
        return (
          <label key={filterOpt} htmlFor={filterOpt}>
            <>
              <input
                id={filterOpt}
                key={filterOpt}
                type="radio"
                checked={groupChat === filterOpt}
                onChange={handleChange}
                value={filterOpt}
              />
              {filterOpt}
            </>
          </label>
        );
      })}
    </>
  );
}
