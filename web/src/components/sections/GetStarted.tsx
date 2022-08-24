import { belowBreakpoint, MIN_HEIGHT } from '../../theme'
import { logEvent } from '../../utils/gtag'
import Button from '../Button'
import { DefaultContentContainer } from '../DefaultContentContainer'
import { Gradient } from '../Gradient'
import { Navbar } from '../Navbar'
import { Text } from '../Text'

const DISPLAY_TEXT = 'What will you learn from your texts?'
const DESCRIPTION_TEXT =
  'Learn about your friends and your texting habits with Left on Read, a secure, open-source iMessage analyzer made with ❤️.'

export function GetStarted({
  ctaRef,
}: {
  ctaRef: React.RefObject<HTMLDivElement>
}) {
  const handleGetStarted = () => {
    logEvent({
      action: 'clicked_top_level_download',
      category: 'Top Level Download',
    })

    if (ctaRef.current) {
      ctaRef.current?.scrollIntoView()
    }
  }

  return (
    <DefaultContentContainer>
      <div
        css={{
          height: '100vh',
          minHeight: MIN_HEIGHT,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Gradient />
        <Navbar />
        <div
          css={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            [belowBreakpoint.sm]: {
              alignItems: 'center',
            },
          }}
        >
          <div
            css={{
              width: '70%',
              [belowBreakpoint.md]: {
                width: '90%',
              },
              [belowBreakpoint.sm]: {
                width: '100%',
              },
            }}
          >
            <Text type="display">{DISPLAY_TEXT}</Text>
            <Text type="paragraph">{DESCRIPTION_TEXT}</Text>
            <Button
              label="Get Started →"
              css={{
                marginTop: '64px',
                [belowBreakpoint.sm]: { marginTop: '32px' },
              }}
              onClick={handleGetStarted}
              data-testid="cta-button"
            />
          </div>
        </div>
      </div>
    </DefaultContentContainer>
  )
}
