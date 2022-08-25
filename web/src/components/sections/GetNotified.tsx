import { Button } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import * as React from 'react'

import { LATEST_APP_VERSION_FOR_MARKETING_SITE } from '../../constants/APP_VERSION'
import Theme, { belowBreakpoint } from '../../theme'
import { writeEmailToFirestore } from '../../utils/firestore'
import { logEvent } from '../../utils/gtag'
import { isValidEmail } from '../../utils/validation'
import { DefaultContentContainer } from '../DefaultContentContainer'
import HighlightedText from '../HighlightedText'
import Input from '../Input'
import { StatusLoader, StatusLoaderState } from '../StatusLoader'

const DEFAULT_PARAGRAPH_WEIGHT = 400

export const handleDownload = () => {
  logEvent({
    action: 'download',
    category: 'Download',
  })
  window.location.href = `https://github.com/Left-on-Read/leftonread/releases/download/v${LATEST_APP_VERSION_FOR_MARKETING_SITE}/Left-on-Read-${LATEST_APP_VERSION_FOR_MARKETING_SITE}.dmg`
}

function Content() {
  return (
    <div>
      <Text>
        <HighlightedText
          text={'Download Left on Read'}
          color={Theme.secondary.main}
        />{' '}
      </Text>
      <Text>
        {'Available on Mac OS. Left on Read is '}
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const notifyContent = (
    <form
      onSubmit={handleSubmitNotify}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Input
        placeholder={'you@example.com'}
        value={email}
        onChange={(updatedEmail) => setEmail(updatedEmail)}
        disabled={state === 'loading' || state === 'success'}
        data-testid="get-notified-input"
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {state !== 'success' && state !== 'loading' && <Button>Enter</Button>}
        {state !== null && <StatusLoader state={state} message={message} />}
      </div>
    </form>
  )

  return (
    <>
      <div
        style={{
          backgroundColor: Theme.palette.frogGreen.faded,
          paddingTop: '36px',
          paddingBottom: '50px',
        }}
      >
        <DefaultContentContainer>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Text>
              Join our community to learn about exciting new features and
              updates
            </Text>
            {notifyContent}
          </div>
        </DefaultContentContainer>
      </div>

      <DefaultContentContainer>
        <div
          style={{
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
            style={{
              marginTop: '25px',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            {/* <Button
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
            /> */}
            <Button>Download</Button>
          </div>
        </div>
      </DefaultContentContainer>
    </>
  )
}
