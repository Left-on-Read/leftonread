/** @jsx jsx */
import { jsx } from '@emotion/core'
import * as React from 'react'
import HighlightedText from '../HighlightedText'
import Theme, { belowBreakpoint } from '../../theme'
import Input from '../Input'
import Button from '../Button'
import { DefaultContentContainer } from '../DefaultContentContainer'
import { Text } from '../Text'
import { writeEmailToFirestore } from '../../utils/firestore'
import { StatusLoader, StatusLoaderState } from '../StatusLoader'
import { logEvent } from '../../utils/gtag'

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

export function GetNotified({
  ctaRef,
}: {
  ctaRef: React.RefObject<HTMLDivElement>
}) {
  const [email, setEmail] = React.useState<string>('')
  const [message, setMessage] = React.useState<string | undefined>(undefined)
  const [state, setState] = React.useState<StatusLoaderState | null>(null)

  const signUpEmail = async (submittedEmail: string) => {
    logEvent({
      action: 'submit_email',
      category: 'Notify',
    })

    setState('loading')
    setMessage(undefined)

    try {
      await writeEmailToFirestore(submittedEmail)
      logEvent({
        action: 'submit_email_success',
        category: 'Notify',
      })
      setState('success')
      setMessage('Successfully signed up!')
    } catch (e) {
      setState('error')
      setMessage('Uh oh, something went wrong.')
      logEvent({
        action: 'submit_email_error',
        category: 'Notify',
        label: e,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signUpEmail(email)
  }

  return (
    <DefaultContentContainer>
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          padding: '80px 0',
          [belowBreakpoint.sm]: {
            padding: '40px 0',
          },
        }}
        ref={ctaRef}
      >
        <Content />
        <form
          onSubmit={handleSubmit}
          css={{
            marginTop: '40px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            [belowBreakpoint.md]: {
              marginTop: '80px',
              flexDirection: 'column',
              alignItems: 'initial',
            },
            [belowBreakpoint.sm]: {
              marginTop: '40px',
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
              [belowBreakpoint.sm]: {
                fontSize: '16px',
                height: '24px',
                width: '230px',
              },
            }}
            placeholder={'you@example.com'}
            value={email}
            onChange={(updatedEmail) => setEmail(updatedEmail)}
            disabled={state === 'loading' || state === 'success'}
          />
          <div
            css={{
              display: 'flex',
              alignItems: 'center',
              [belowBreakpoint.md]: {
                marginTop: '12px',
              },
            }}
          >
            {state !== 'success' && state !== 'loading' && (
              <Button
                type="submit"
                css={{
                  marginLeft: '40px',
                  fontSize: '22px',
                  [belowBreakpoint.md]: {
                    fontSize: '18px',
                    marginLeft: '0px',
                  },
                }}
                label={'Notify me'}
              />
            )}
            {state !== null && <StatusLoader state={state} message={message} />}
          </div>
        </form>
      </div>
    </DefaultContentContainer>
  )
}
