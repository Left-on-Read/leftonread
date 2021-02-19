import React from 'react';
import Select from 'react-select';

interface ContactFilterProps {
  options: any[];
  handleChange: (selected?: any) => void;
  contact: any;
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
