const Theme = {
  primary: '#9086D6',
}

export default Theme

const Breakpoints = {
  sm: 600, // Mobile devices
  md: 850, // Tablets
  lg: 1200, // Desktop
}

export const belowBreakpoint = {
  sm: `@media (max-width: ${Breakpoints.sm}px)`,
  md: `@media (max-width: ${Breakpoints.md}px)`,
  lg: `@media (max-width: ${Breakpoints.lg}px)`,
}
