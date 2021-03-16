/** @jsx jsx */
import * as React from 'react'
import { jsx, css } from '@emotion/core'
import Theme, { belowBreakpoint } from '../../theme'
import { DefaultContentContainer } from '../DefaultContentContainer'
import { TextNotification } from '../TextNotification'
import { motion, AnimateSharedLayout } from 'framer-motion'
import { Text } from '../Text'
import { LIST_OF_TEXTS } from '../charts/data'
import type { IText } from '../charts/types'
import BarChart from '../charts/BarChart'

const HEADER_TEXT = 'Unique analytics.'
const DESCRIPTION_TEXT = `
  Feel empowered about how you use technology. 
  We render graphs about your text messages, so you can feel better about your relationship with your phone.`

const styles = {
  mainContainer: css({
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: Theme.palette.frogGreen.faded,
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
    <div css={styles.mainContainer}>
      <DefaultContentContainer>
        <div css={styles.contentContainer}>
          <div css={styles.infoContainer}>
            <div>
              <Text type="header">{HEADER_TEXT}</Text>
              <Text type="paragraph">{DESCRIPTION_TEXT}</Text>
            </div>
            <div css={styles.textStackWrapper}>
              <TextStack data={texts} css={styles.textStack} />
            </div>
            <div css={styles.chartWrapper}>
              <BarChart
                title={'Top Received Words'}
                labels={receivedWords.labels}
                data={receivedWords.data}
              />
            </div>
          </div>
          {/* NOTE(teddy): This creates space for the text message list */}
          <div css={styles.textStackBlock} />
        </div>
      </DefaultContentContainer>
      <TextList data={texts} css={styles.textList} />
    </div>
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
            <motion.li layout key={`list-text-${text.key}`}>
              <TextNotification name={text.name} text={text.text} />
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
    return <TextNotification name={''} text={''} />
  }

  return (
    <motion.div
      key={`stack-text-${text.key}`}
      className={className}
      css={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <TextNotification name={text.name} text={text.text} />
    </motion.div>
  )
}
