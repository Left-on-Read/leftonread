import log from 'electron-log';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import * as sqlite3 from 'sqlite3';

import { getContactOptions } from '../../utils/initUtils/contacts';
import { IContactData } from '../../utils/initUtils/contacts/types';

interface ContactFilterProps {
  handleChange: (selected?: IContactData | null | undefined) => void;
  contact: IContactData | null | undefined;
  db: sqlite3.Database;
}

export default function ContactFilter(props: ContactFilterProps) {
  const [contactOptions, setContactOptions] = useState<IContactData[]>([]);
  const { contact, handleChange, db } = props;

  useEffect(() => {
    async function getContacts() {
      try {
        const allContacts = await getContactOptions(db);
        setContactOptions(allContacts);
      } catch (err) {
        log.error('ERROR: fetching contact options', err);
      }
    }
    getContacts();
  }, [db]);

  return (
    <Select
      isClearable
      defaultValue={contact}
      onChange={handleChange}
      options={contactOptions}
    />
  );
}
