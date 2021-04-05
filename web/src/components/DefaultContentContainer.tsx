import { belowBreakpoint } from '../theme'

export function DefaultContentContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      css={{
        padding: '0 128px',
        [belowBreakpoint.lg]: {
          padding: '0 64px',
        },
        [belowBreakpoint.sm]: {
          padding: '0 32px',
        },
        height: '100%',
      }}
    >
      {children}
    </div>
  )
}
