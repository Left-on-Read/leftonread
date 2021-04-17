import React from 'react';
import Select from 'react-select';
import { IContactData } from '../../utils/initUtils/contacts/types';

interface ContactFilterProps {
  options: IContactData[];
  handleChange: (selected?: IContactData | null | undefined) => void;
  contact: IContactData | null | undefined;
}

export default function ContactFilter(props: ContactFilterProps) {
  const { contact, options, handleChange } = props;
  return (
    <Select
      isClearable
      defaultValue={contact}
      onChange={handleChange}
      options={options}
    />
  );
}
