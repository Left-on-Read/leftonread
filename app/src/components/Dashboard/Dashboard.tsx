import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';

import { ChartTabs } from './ChartTabs';
import { Navbar } from './Navbar';

export function Dashboard() {
  // const handleContactChange = (selected?: IContactData | null | undefined) => {
  //   setContact(selected?.value);
  // };

  // const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setLimit(Number(event.target.value));
  // };

  // const handleGroupChatChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setGroupChat(event.target.value as GroupChatFilters);
  // };

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      await ipcRenderer.invoke('initialize-tables');
      setIsLoading(false);
    };

    init();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
        <LimitFilter handleChange={handleLimitChange} limit={limit} />
        <GroupChatFilter
          handleChange={handleGroupChatChange}
          groupChat={groupChat}
        />
        <ContactFilter
          contact={{
            value: contact,
          }}
          handleChange={handleContactChange}
        />
      </div> */}
      <div style={{ padding: 48, paddingTop: 90 }}>
        <ChartTabs />
      </div>
    </div>
  );
}
