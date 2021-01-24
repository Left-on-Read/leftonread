/** @jsx jsx */
import { jsx } from '@emotion/core'
import * as React from 'react'
import HighlightedText from '../HighlightedText'
import Theme, { belowBreakpoint } from '../../theme'
import Input from '../Input'
import Button from '../Button'
import { DefaultContentContainer } from '../DefaultContentContainer'
import { Text } from '../Text'

const DEFAULT_PARAGRAPH_WEIGHT = 400

function Content() {
  return (
    <div>
      <Text type="header">
        <HighlightedText
          text={'Get notified for early access'}
          color={Theme.secondary.main}
        />
      </Text>
      <Text type="paragraph">
        {"We're working on reimagining Left on Read to make it more "}
        <HighlightedText
          text={'insightful'}
          color={Theme.palette.sherwoodGreen.main}
          weight={DEFAULT_PARAGRAPH_WEIGHT}
        />
        {', '}
        <HighlightedText
          text={'beautiful'}
          color={Theme.palette.skyBlue.main}
          weight={DEFAULT_PARAGRAPH_WEIGHT}
        />
        {', and '}
        <HighlightedText
          text={'performant'}
          color={Theme.palette.palePink.main}
          weight={DEFAULT_PARAGRAPH_WEIGHT}
        />
        {' than the first version 🚀.'}
      </Text>
      <Text type="paragraph">
        {"We don't want to spoil too much, but the new Left on Read will "}
        <HighlightedText
          text={'run offline'}
          color={Theme.palette.canaryYellow.main}
          weight={DEFAULT_PARAGRAPH_WEIGHT}
        />
        {' and be ENTIRELY '}
        <HighlightedText
          text={'open source'}
          color={Theme.secondary.main}
          weight={DEFAULT_PARAGRAPH_WEIGHT}
        />
        {' 👀.'}
      </Text>
    </div>
  )
}

export function GetNotified() {
  return (
    <DefaultContentContainer>
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          padding: '120px 0',
        }}
      >
        <Content />
        <div
          css={{
            marginTop: '40px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            [belowBreakpoint.sm]: {
              marginTop: '80px',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            },
          }}
        >
          <Input
            css={{
              fontSize: '22px',
              height: '32px',
              width: '350px',
              [belowBreakpoint.md]: {
                fontSize: '18px',
                height: '28px',
                width: '270px',
              },
            }}
            placeholder={'you@gmail.com'}
          />
          <Button
            css={{
              marginLeft: '40px',
              fontSize: '22px',
              [belowBreakpoint.md]: {
                fontSize: '18px',
                marginLeft: '20px',
              },
              [belowBreakpoint.sm]: {
                marginTop: '20px',
                marginLeft: 0,
              },
            }}
            label={'Notify me'}
          />
        </div>
      </div>
    </DefaultContentContainer>
  )
}
