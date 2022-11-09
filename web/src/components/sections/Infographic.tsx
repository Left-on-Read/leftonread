import { Box } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { AnimateSharedLayout, motion } from 'framer-motion'
import * as React from 'react'

import Theme, { belowBreakpoint, MIN_HEIGHT } from '../../theme'
import BarChart from '../charts/BarChart'
import { LIST_OF_TEXTS } from '../charts/data'
import { DefaultContentContainer } from '../DefaultContentContainer'
import { TextNotification } from '../TextNotification'
import type { IText } from '../types'

export function Infographic() {
  const { texts, receivedWords } = useTextData()

  return (
    <Box
      height={{
        base: 'auto',
        lg: '70vh',
      }}
      style={{
        minHeight: MIN_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        // backgroundColor: Theme.palette.frogGreen.faded,
        position: 'relative',
      }}
      bgGradient="linear(to-b, white, purple.50)"
    >
      <DefaultContentContainer>
        <Box
          style={{
            display: 'flex',
            height: '100%',
          }}
          flexDirection={{
            base: 'column',
            lg: 'row',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <div>
              <Box
                style={{
                  lineHeight: 1.3,
                  display: 'flex',
                }}
                fontSize={{
                  base: '4xl',
                  lg: '6xl',
                }}
                fontWeight="extrabold"
                marginTop={{
                  base: '100px',
                }}
              >
                <Text
                  bgGradient="linear(to-r, blue.400, purple.400)"
                  bgClip="text"
                >
                  Rediscover relationships
                </Text>
                <div>&nbsp;📈</div>
              </Box>
              <Text
                fontSize={{
                  base: 'md',
                  md: 'lg',
                }}
                style={{ marginTop: 32 }}
              >
                {`Left on Read provides powerful analytics and productivity tools to help you manage your conversations. Schedule messages, receive response reminders, and manage your inbox. We promise
                you've never seen your texts like this before.`}
              </Text>
            </div>
            <Box
              style={{
                justifyContent: 'center',
                width: '100%',
              }}
              display={{
                base: 'flex',
                lg: 'none',
              }}
            >
              <TextStack data={texts} />
            </Box>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '40px',
              }}
              width={{
                base: '110%',
                sm: '100%',
                md: '80%',
              }}
            >
              <BarChart
                title={'Top Received Words'}
                labels={receivedWords.labels}
                data={receivedWords.data}
              />
            </Box>
          </div>
          {/* NOTE(teddy): This creates space for the text message list */}
          <Box
            flex={{
              base: '0 0 100px',
              lg: '0 0 300px',
            }}
          />
        </Box>
      </DefaultContentContainer>
      <Box
        display={{
          base: 'none',
          lg: 'initial',
        }}
      >
        <TextList data={texts} />
      </Box>
    </Box>
  )
}

function useTextData(): {
  texts: Array<IText>
  receivedWords: {
    labels: Array<string>
    data: Array<number>
  }
} {
  const MAX_ITEMS = 5

  const [texts, setTexts] = React.useState<Array<IText>>([])
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

  const sortedReceivedWords = Array.from(receivedWords.keys())
    .sort((a, b) => {
      const aValue = receivedWords.get(a) ?? 0
      const bValue = receivedWords.get(b) ?? 0
      return bValue - aValue
    })
    .slice(0, 5)

  const receivedWordsData = sortedReceivedWords
    .map((word) => receivedWords.get(word))
    .filter((value: number | undefined): value is number => value !== undefined)

  return {
    texts: texts,
    receivedWords: {
      labels: sortedReceivedWords,
      data: receivedWordsData,
    },
  }
}

function TextList({ data }: { data: Array<IText> }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '30px',
        right: '10px',
        marginRight: '12px',
        [belowBreakpoint.lg]: {
          display: 'none',
        },
      }}
    >
      <AnimateSharedLayout>
        <motion.ul
          layout
          style={{
            listStyle: 'none',
          }}
        >
          {data.map((text) => (
            <motion.li layout key={`list-text-${text.key}`}>
              <TextNotification
                name={text.name}
                text={text.text}
                avatar={text.avatar}
              />
            </motion.li>
          ))}
        </motion.ul>
      </AnimateSharedLayout>
    </div>
  )
}

function TextStack({ data }: { data: Array<IText> }) {
  const text = data[0]

  if (!text) {
    return (
      <TextNotification
        name={''}
        text={''}
        avatar={{
          source: '/alexander.png',
          color: Theme.palette.petalPurple.main,
        }}
      />
    )
  }

  return (
    <motion.div
      key={`stack-text-${text.key}`}
      style={{
        marginTop: '40px',
        display: 'block',
        opacity: 0,
      }}
      animate={{ opacity: 1 }}
    >
      <TextNotification
        name={text.name}
        text={text.text}
        avatar={text.avatar}
      />
    </motion.div>
  )
}
