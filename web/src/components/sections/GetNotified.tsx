import * as React from 'react'

import Theme, { belowBreakpoint } from '../../theme'
import { writeEmailToFirestore } from '../../utils/firestore'
import { logEvent } from '../../utils/gtag'
import { isValidEmail } from '../../utils/validation'
import Button from '../Button'
import { DefaultContentContainer } from '../DefaultContentContainer'
import HighlightedText from '../HighlightedText'
import Input from '../Input'
import { StatusLoader, StatusLoaderState } from '../StatusLoader'
import { Text } from '../Text'

const DEFAULT_PARAGRAPH_WEIGHT = 400

export const handleDownload = () => {
  const versionNumber = '0.1.10'
  logEvent({
    action: 'download',
    category: 'Download',
  })
  window.location.href = `https://github.com/Left-on-Read/leftonread/releases/download/v${versionNumber}/Left-on-Read-${versionNumber}.dmg`
}

function Content() {
  return (
    <div>
      <Text type="header">
        <HighlightedText
          text={'Get Left on Read for Mac'}
          color={Theme.secondary.main}
        />
      </Text>
      <Text type="paragraph">
        {'Learning about your texts is a click away. Our Desktop app is '}
        <HighlightedText
          text={'free to try'}
          color={Theme.palette.sherwoodGreen.main}
          weight={DEFAULT_PARAGRAPH_WEIGHT}
        />
        {', '}
        <HighlightedText
          text={'open-source'}
          color={Theme.palette.skyBlue.main}
          weight={DEFAULT_PARAGRAPH_WEIGHT}
        />
        {', and '}
        <HighlightedText
          text={'fun'}
          color={Theme.palette.palePink.main}
          weight={DEFAULT_PARAGRAPH_WEIGHT}
        />
        {' 🚀.'}
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

    if (!isValidEmail(submittedEmail)) {
      setState('error')
      setMessage('Please enter a valid email.')
      return
    }

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

  const handleSubmitNotify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signUpEmail(email)
  }

  // UNUSED RIGHT NOW - REPLACED BY DOWNLOAD BUTTON
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const notiftyContent = (
    <form
      onSubmit={handleSubmitNotify}
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
        data-testid="get-notified-input"
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
            data-testid="get-notified-button"
          />
        )}
        {state !== null && <StatusLoader state={state} message={message} />}
      </div>
    </form>
  )

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
        <div
          css={{
            marginTop: '25px',
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <Button
            onClick={handleDownload}
            type="submit"
            css={{
              height: '75px',
              width: '350px',
              fontSize: '24px',
              [belowBreakpoint.md]: {
                fontSize: '18px',
                marginLeft: '0px',
              },
            }}
            label={
              <div
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                }}
              >
                <img
                  src="https://assets-global.website-files.com/60ca686c96b42034829a80d3/60e4770d2aeb7a0efe3d8d97_apple.svg"
                  loading="lazy"
                  alt="Apple logo"
                  className="download-img"
                />
                Download for Mac
              </div>
            }
          />
        </div>
      </div>
    </DefaultContentContainer>
  )
}
