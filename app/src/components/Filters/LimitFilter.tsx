import React from 'react';

interface LimitFilterProps {
  limit: number;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LimitFilter(props: LimitFilterProps) {
  const { limit, handleChange } = props;
  return <input type="text" value={limit} onChange={handleChange} />;
}
