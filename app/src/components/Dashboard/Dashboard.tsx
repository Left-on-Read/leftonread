import { Footer } from '../Footer';
import { ChartTabs } from './ChartTabs';
import { Navbar } from './Navbar';

export function Dashboard({ onRefresh }: { onRefresh: () => void }) {
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

  return (
    <div>
      <Navbar onRefresh={onRefresh} />

      <div style={{ padding: 48, paddingTop: 90 }}>
        <ChartTabs />
      </div>
      <Footer />
    </div>
  );
}
