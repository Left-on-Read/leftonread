/** @jsx jsx */
import * as React from 'react'
import { jsx, css } from '@emotion/core'
import Theme, { belowBreakpoint } from '../../theme'
import { DefaultContentContainer } from '../DefaultContentContainer'
import { Bar } from 'react-chartjs-2'
import { TextNotification } from '../TextNotification'
import { motion, AnimateSharedLayout } from 'framer-motion'

const styles = {
  titleText: {
    fontWeight: 800,
    textStroke: '1px black',
    color: 'rgba(0, 0, 0, .72)',
    fontSize: '50px',
    [belowBreakpoint.lg]: {
      fontSize: '40px',
    },
    [belowBreakpoint.md]: {
      fontSize: '36px',
    },
    [belowBreakpoint.sm]: {
      fontSize: '30px',
    },
  },
  descriptionText: {
    marginTop: '26px',
    fontSize: '26px',
    [belowBreakpoint.sm]: {
      fontSize: '20px',
    },
    fontWeight: 300,
  },
}

const TITLE_TEXT = 'Unique analytics.'
const DESCRIPTION_TEXT = `
  It's time to start feeling empowered about how you use technology. 
  Left on Read is the world's first text analyzer. 
  We render graphs about your text messages, so you can feel better about your relationship with your phone.`

export function Infographic() {
  const { texts, receivedWords } = useTextData()

  console.log(receivedWords)
  return (
    <div
      css={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: Theme.palette.frogGreen.faded,
        position: 'relative',
      }}
    >
      <DefaultContentContainer>
        <div
          css={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              css={{
                paddingBottom: '80px',
              }}
            >
              <div css={styles.titleText}>{TITLE_TEXT}</div>
              <div css={styles.descriptionText}>{DESCRIPTION_TEXT}</div>
            </div>
            <div
              css={{
                display: 'flex',
                flex: '1 1 0',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ExampleChart
                labels={receivedWords.labels}
                data={receivedWords.data}
              />
            </div>
          </div>
          <div css={{ flex: '0 0 400px' }} />
        </div>
      </DefaultContentContainer>
      <Texts data={texts} />
    </div>
  )
}

type Text = {
  key: number
  name: string
  text: string
  length: number
  words?: Array<string>
}

function useTextData() {
  const MAX_ITEMS = 5

  const [texts, setTexts] = React.useState<Array<Text>>([])
  const [counter, setCounter] = React.useState(0)
  const [receivedWords, setReceivedWords] = React.useState<Map<string, number>>(
    new Map()
  )

  const handleNextText = () => {
    const nextText = LIST_OF_TEXTS[counter]

    const updatedReceivedWords = new Map(receivedWords)
    nextText.words?.forEach((word) => {
      const currentValue = updatedReceivedWords.get(word) ?? 0
      updatedReceivedWords.set(word, currentValue + 1)
    })
    console.log(updatedReceivedWords)
    setReceivedWords(updatedReceivedWords)
    setTexts((texts) => [nextText, ...texts.slice(0, MAX_ITEMS - 1)])

    setTimeout(() => {
      if (counter >= LIST_OF_TEXTS.length - 1) {
        setCounter(0)
      } else {
        setCounter(counter + 1)
      }
    }, nextText.length)
  }

  React.useEffect(() => {
    handleNextText()
  }, [counter])

  console.log(receivedWords)

  const sortedReceivedWords = Array.from(receivedWords.keys())
    .sort((a, b) => {
      const aValue = receivedWords.get(a) ?? 0
      const bValue = receivedWords.get(b) ?? 0
      return bValue - aValue
    })
    .slice(0, 5)

  return {
    texts: texts,
    receivedWords: {
      labels: sortedReceivedWords,
      data: sortedReceivedWords.map((word) => receivedWords.get(word)),
    },
  }
}

function ExampleChart({
  labels,
  data,
}: {
  labels: Array<string>
  data: Array<number>
}) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Top Received Words',
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
  }

  return <Bar data={chartData} options={options} />
}

function Texts({ data }: { data: Array<Text> }) {
  return (
    <div
      css={{
        position: 'absolute',
        top: '30px',
        right: '10px',
      }}
    >
      <AnimateSharedLayout>
        <motion.ul
          layout
          css={{
            listStyle: 'none',
          }}
        >
          {data.map((text) => (
            <motion.li layout key={text.key}>
              <TextNotification name={text.name} text={text.text} />
            </motion.li>
          ))}
        </motion.ul>
      </AnimateSharedLayout>
    </div>
  )
}

const DEFAULT_LENGTH = 5000

const LIST_OF_TEXTS: Array<Text> = [
  {
    key: 1,
    name: 'Alexander',
    text:
      'Dude! Did you see that crazy article on the New York Times? Insane!!',
    length: DEFAULT_LENGTH,
    words: ['dude', 'crazy', 'article', 'new', 'york', 'times', 'insane'],
  },
  {
    key: 2,
    name: 'Mariah',
    text:
      'Hey babe! Ready to head out soon? Our reservation is in 30 minutes...',
    length: 1000,
    words: ['crazy', 'insane', 'reservation', 'babe'],
  },
  {
    key: 3,
    name: 'Mariah',
    text: 'love you! but dont be late',
    length: DEFAULT_LENGTH,
    words: ['love', 'babe', 'late'],
  },
  {
    key: 4,
    name: 'Amelia',
    text:
      'were u able to finish ur section of the project? i have some ideas on how we can maybe get it up to B quality',
    length: DEFAULT_LENGTH,
    words: ['finish', 'project', 'quality', 'love'],
  },
  {
    key: 5,
    name: 'Phillip',
    text:
      'Wanna get smashhed tn with the boys? Looking to cause some trouble 😈',
    length: DEFAULT_LENGTH,
    words: ['smashed', 'boys', 'trouble'],
  },
  {
    key: 6,
    name: 'Jonah',
    text: 'Man we gotta go to the movies later, im tryna get LIT',
    length: DEFAULT_LENGTH,
    words: ['movie', 'lit', 'man'],
  },
]
