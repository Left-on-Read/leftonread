import React from 'react';

interface ChartLoaderProps {
  titleText: string,
}

export default function ChartLoader(props : ChartLoaderProps) {
  const loadingText = `Loading ${props.titleText} chart...`;
  return <div>{loadingText}</div>;
}
