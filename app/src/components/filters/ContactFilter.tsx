import React from 'react';
import Select from 'react-select';

interface ContactFilterProps {
  options: ContactOptions.ContactData[];
  handleChange: (
    selected?: ContactOptions.ContactData | null | undefined
  ) => void;
  contact: ContactOptions.ContactData | null | undefined;
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
