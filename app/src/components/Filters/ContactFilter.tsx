import { ChatTableNames } from 'analysis/tables/types';
import log from 'electron-log';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import * as sqlite3 from 'sqlite3';
import { PHONE_NUMBER_LENGTH } from 'utils/normalization';
import { allP } from 'utils/sqliteWrapper';

export interface IContactData {
  value?: string;
  label?: string;
  mycount?: number;
}

interface ContactFilterProps {
  handleChange: (selected?: IContactData | null | undefined) => void;
  contact: IContactData | null | undefined;
  db: sqlite3.Database;
}

enum Columns {
  COUNT = 'mycount',
  VALUE = 'value',
  LABEL = 'label',
  ID = 'id',
}

async function getContactOptions(
  db: sqlite3.Database
): Promise<IContactData[]> {
  const q = `
    SELECT
        COALESCE(contact_name, h.id) as ${Columns.VALUE},
        COALESCE(contact_name, h.id) as ${Columns.LABEL},
        COUNT(*) as ${Columns.COUNT}
      FROM handle h
        -- NOTE: for some reason a direct join to messages
        -- causes a CORRUPT malformed error
        LEFT JOIN ${ChatTableNames.COUNT_TABLE}
          ON contact = COALESCE(contact_name, h.id)
      -- NOTE: don't bother showing robo-contacts,
      -- i.e., Amazon shipping updates
      -- This might be problematic on short emails
      WHERE LENGTH(h.id) >= ${PHONE_NUMBER_LENGTH}
      GROUP BY COALESCE(contact_name, h.id)
      ORDER BY
      CASE
        -- NOTE: must use the COALESCE value here,
        -- because all ids are phone numbers/emails
        WHEN ${Columns.VALUE} LIKE '%@%' THEN -1
        WHEN ${Columns.VALUE} GLOB '*[0-9]*' THEN -2
        ELSE ${Columns.COUNT}
      END DESC
    `;
  return allP(db, q);
}

export function ContactFilter(props: ContactFilterProps) {
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
