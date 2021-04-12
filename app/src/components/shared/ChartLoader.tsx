import React from 'react';

interface ChartLoaderProps {
  titleText: string;
}

export default function ChartLoader(props: ChartLoaderProps) {
  const { titleText } = props;
  const loadingText = `Loading ${titleText} chart...`;
  return <div>{loadingText}
  </div>;
}
