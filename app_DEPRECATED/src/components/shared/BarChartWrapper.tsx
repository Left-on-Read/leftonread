import React from 'react';
import { Bar } from 'react-chartjs-2';

import { AppearanceTracker } from '../AppearanceTracker';
import ChartLoader from './ChartLoader';
import NoResults from './NoResults';

// TODO: refactor this into a general chart wrapper
interface BarChartWrapperProps {
  titleText: string;
  success: boolean;
  labels: string[];
  data: Chart.ChartData;
  options: Chart.ChartOptions;
  eventContext: {
    label: string;
  };
}

export default function BarChartWrapper(props: BarChartWrapperProps) {
  const { success, data, titleText, options, labels, eventContext } = props;
  if (success) {
    if (labels.length > 0) {
      return (
        <AppearanceTracker eventContext={eventContext}>
          <Bar data={data} options={options} />
        </AppearanceTracker>
      );
    }
    return <NoResults titleText={titleText} />;
  }
  return <ChartLoader titleText={titleText} />;
}
