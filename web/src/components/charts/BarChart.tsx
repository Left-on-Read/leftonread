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
        backgroundColor: defaultTheme.colors.blue['100'],
        borderColor: defaultTheme.colors.blue['400'],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  }

  const options = {
    legend: {
      labels: {
        fontSize: 16,
      },
    },
    scales: {
      yAxes: [
        {
          // gridLines: {
          //   color: 'rgba(0, 0, 0, 0)',
          // },
          ticks: {
            beginAtZero: true,
            precision: 0,
            fontSize: 16,
          },
        },
      ],
      xAxes: [
        {
          // gridLines: {
          //   color: 'rgba(0, 0, 0, 0)',
          // },
          ticks: {
            precision: 0,
            fontSize: 16,
          },
        },
      ],
    },
    responsive: true,
  }

  return <Bar data={chartData} options={options} />
}
