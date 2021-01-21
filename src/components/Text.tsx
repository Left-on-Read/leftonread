/** @jsx jsx */
import { jsx } from '@emotion/core'
import { belowBreakpoint } from '../theme'

export type TextType = 'paragraph' | 'header' | 'display'

const styles = {
  displayText: {
    fontWeight: 800,
    textStroke: '1px black',
    color: 'rgba(0, 0, 0, .72)',
    fontSize: '80px',
    [belowBreakpoint.lg]: {
      fontSize: '64px',
    },
    [belowBreakpoint.md]: {
      fontSize: '58px',
    },
    [belowBreakpoint.sm]: {
      fontSize: '50px',
    },
  },
  headerText: {
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
  paragraphText: {
    fontWeight: 300,
    fontSize: '26px',
    [belowBreakpoint.sm]: {
      fontSize: '20px',
    },
  },
}

export function Text({
  type,
  children,
  className,
}: {
  type: TextType
  children?: React.ReactNode
  className?: string
}) {
  let classToApply = {}
  if (type === 'paragraph') {
    classToApply = styles.paragraphText
  } else if (type === 'header') {
    classToApply = styles.headerText
  } else if (type === 'display') {
    classToApply = styles.displayText
  }

  return (
    <div className={className} css={classToApply}>
      {children}
    </div>
  )
}
