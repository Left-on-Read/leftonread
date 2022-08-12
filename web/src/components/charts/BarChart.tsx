import { Bar } from 'react-chartjs-2'

import Theme from '../../theme'

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
        backgroundColor: [
          Theme.palette.canaryYellow.graphFaded,
          Theme.palette.sherwoodGreen.graphFaded,
          Theme.palette.skyBlue.graphFaded,
          Theme.palette.palePink.graphFaded,
          Theme.palette.petalPurple.graphFaded,
        ],
        borderColor: [
          Theme.palette.canaryYellow.main,
          Theme.palette.sherwoodGreen.main,
          Theme.palette.skyBlue.main,
          Theme.palette.palePink.main,
          Theme.palette.petalPurple.main,
        ],
        borderWidth: 1,
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
          ticks: {
            beginAtZero: true,
            precision: 0,
            fontSize: 16,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            fontSize: 16,
          },
        },
      ],
    },
    responsive: true,
  }

  return <Bar data={chartData} options={options} />
}
