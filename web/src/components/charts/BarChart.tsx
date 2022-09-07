import { theme as defaultTheme } from '@chakra-ui/react'
import { Bar } from 'react-chartjs-2'

export default function BarChart({
  labels,
  data,
  title,
}: {
  labels: Array<string>
  data: Array<number>
  title: string
}) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        // backgroundColor: defaultTheme.colors.blue['100'],
        // borderColor: defaultTheme.colors.blue['400'],
        borderWidth: 1,
        borderRadius: 8,
        gradient: {
          backgroundColor: {
            axis: 'y' as const,
            colors: {
              0: defaultTheme.colors.blue[400],
              50: defaultTheme.colors.blue[200],
            },
          },
        },
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Top Received Words',
        font: {
          size: 18,
          family: 'Roboto',
          weight: 'light',
        },
      },
    },
    scales: {
      yAxis: {
        ticks: {
          beginAtZero: true,
          precision: 0,
          font: {
            size: 16,
            family: 'Roboto',
          },
        },
      },
      xAxis: {
        grid: {
          display: false,
        },
        ticks: {
          precision: 0,
          font: {
            size: 16,
            family: 'Roboto',
          },
        },
      },
    },
    responsive: true,
  }

  return <Bar data={chartData} options={options} />
}
