import { belowBreakpoint } from '../theme'

export type TextType =
  | 'paragraph'
  | 'bold'
  | 'header'
  | 'display'
  | 'secondary-header'

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
    padding: '32px 0',
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
    padding: '16px 0',
  },
  paragraphText: {
    fontWeight: 300,
    fontSize: '26px',
    [belowBreakpoint.sm]: {
      fontSize: '20px',
    },
    padding: '4px 0',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: '26px',
    [belowBreakpoint.sm]: {
      fontSize: '20px',
    },
    padding: '8px 0',
  },
  secondaryHeader: {
    fontWeight: 800,
    textStroke: '1px black',
    color: 'rgba(0, 0, 0, .72)',
    fontSize: '25px',
    [belowBreakpoint.lg]: {
      fontSize: '28px',
    },
    [belowBreakpoint.md]: {
      fontSize: '28px',
    },
    [belowBreakpoint.sm]: {
      fontSize: '28px',
    },
    padding: '16px 0',
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
  } else if (type === 'bold') {
    classToApply = styles.boldText
  } else if (type === 'secondary-header') {
    classToApply = styles.secondaryHeader
  }

  return (
    <div className={className} css={classToApply}>
      {children}
    </div>
  )
}
