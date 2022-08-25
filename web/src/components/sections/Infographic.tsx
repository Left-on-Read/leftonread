import { Box } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { css } from '@emotion/react'
import { AnimateSharedLayout, motion } from 'framer-motion'
import * as React from 'react'

import Theme, { belowBreakpoint, MIN_HEIGHT } from '../../theme'
import BarChart from '../charts/BarChart'
import { LIST_OF_TEXTS } from '../charts/data'
import { DefaultContentContainer } from '../DefaultContentContainer'
import { TextNotification } from '../TextNotification'
import type { IText } from '../types'

const styles = {
  mainContainer: css({
    height: '100vh',
    minHeight: MIN_HEIGHT,
    display: 'flex',
    flexDirection: 'column',
    // backgroundColor: Theme.palette.frogGreen.faded,
    position: 'relative',
  }),
  contentContainer: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  }),
  infoContainer: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [belowBreakpoint.lg]: {
      width: '100%',
    },
  }),
  textStackWrapper: css({
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  }),
  textStack: css({
    display: 'none',
    [belowBreakpoint.lg]: {
      marginTop: '40px',
      display: 'block',
    },
  }),
  chartWrapper: css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '40px',
    width: '70%',
    [belowBreakpoint.md]: {
      width: '100%',
    },
  }),
  textStackBlock: css({
    flex: '0 0 400px',
    [belowBreakpoint.lg]: {
      display: 'none',
    },
  }),
  textList: css({
    marginRight: '12px',
    [belowBreakpoint.lg]: {
      display: 'none',
    },
  }),
}

export function Infographic() {
  const { texts, receivedWords } = useTextData()

  return (
    <Box
      style={{
        height: '100vh',
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
            flexDirection: 'row',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div>
              <Box
                fontSize="6xl"
                fontWeight="extrabold"
                style={{
                  lineHeight: 1.3,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Text
                  bgGradient="linear(to-r, blue.400, purple.400)"
                  bgClip="text"
                >
                  Learn about your habits
                </Text>
                <div style={{ marginLeft: 16 }}>📈</div>
              </Box>
              <Text fontSize="xl" style={{ marginTop: 32 }}>
                {`Left on Read renders graphs about your text messages, so you can feel
                better about your relationship with your phone. We promise
                you've never seen analytics like these before.`}
              </Text>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <TextStack data={texts} css={styles.textStack} />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '40px',
                width: '90%',
              }}
            >
              <BarChart
                title={'Top Received Words'}
                labels={receivedWords.labels}
                data={receivedWords.data}
              />
            </div>
          </div>
          {/* NOTE(teddy): This creates space for the text message list */}
          <div css={styles.textStackBlock} />
        </Box>
      </DefaultContentContainer>
      <TextList data={texts} css={styles.textList} />
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

function TextList({
  data,
  className,
}: {
  data: Array<IText>
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        top: '30px',
        right: '10px',
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

function TextStack({
  data,
  className,
}: {
  data: Array<IText>
  className?: string
}) {
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
      className={className}
      style={{ opacity: 0 }}
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
