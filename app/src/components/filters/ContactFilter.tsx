import React from 'react';
import Select from 'react-select';

// TODO(danilowicz): remove usage of 'any'
/* eslint-disable @typescript-eslint/no-explicit-any */
interface ContactFilterProps {
  options: any[];
  handleChange: (selected?: any) => void;
  contact: any;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

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
