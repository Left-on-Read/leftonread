import { ipcRenderer } from 'electron';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import Select from 'react-select';

export interface IContactData {
  value?: string;
  label?: string;
  mycount?: number;
}

interface ContactFilterProps {
  handleChange: (selected?: IContactData | null | undefined) => void;
  contact: IContactData | null | undefined;
}

export function ContactFilter(props: ContactFilterProps) {
  const [contactOptions, setContactOptions] = useState<IContactData[]>([]);
  const { contact, handleChange } = props;

  useEffect(() => {
    async function getContacts() {
      try {
        const allContacts: IContactData[] = await ipcRenderer.invoke(
          'query-get-contact-options'
        );
        setContactOptions(allContacts);
      } catch (err) {
        log.error('ERROR: fetching contact options', err);
      }
    }
    getContacts();
  }, []);

  return (
    <Select
      isClearable
      defaultValue={contact}
      onChange={handleChange}
      options={contactOptions}
    />
  );
}
