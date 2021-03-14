import React from 'react';

interface NoResultsProps {
  titleText: string;
}

export default function ChartLoader(props: NoResultsProps) {
  const { titleText } = props;
  const noResultsText = `No results for ${titleText} 😢`;
  return <div>{noResultsText}</div>;
}
