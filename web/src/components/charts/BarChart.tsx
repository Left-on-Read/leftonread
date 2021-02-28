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
          Theme.palette.canaryYellow.faded,
          Theme.palette.sherwoodGreen.faded,
          Theme.palette.skyBlue.faded,
          Theme.palette.palePink.faded,
          Theme.palette.petalPurple.faded,
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
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    responsive: true,
  }

  return <Bar data={chartData} options={options} />
}
